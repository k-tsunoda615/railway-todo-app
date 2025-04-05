import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Header } from '../components/Header';
import { url } from '../const';
import './home.scss';

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo'); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const listTabRef = useRef(null);

  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
        setErrorMessage(''); // 成功時にエラーメッセージをクリア
      })
      .catch((err) => {
        // ネットワークエラーの場合のみエラーメッセージを表示
        if (!err.response) {
          setErrorMessage(`リストの取得に失敗しました。${err}`);
        }
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== 'undefined') {
      setSelectListId(listId);
      fetchTasks(listId);
    }
  }, [lists]);

  const fetchTasks = (listId) => {
    axios
      .get(`${url}/lists/${listId}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
        setErrorMessage(''); // 成功時にエラーメッセージをクリア
      })
      .catch((err) => {
        // ネットワークエラーの場合のみエラーメッセージを表示
        if (!err.response) {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        }
      });
  };

  const handleSelectList = (id) => {
    setSelectListId(id);
    fetchTasks(id);
  };

  const handleKeyDown = (e, index) => {
    const listItems = listTabRef.current.querySelectorAll('[role="tab"]');
    const lastIndex = listItems.length - 1;
    let newIndex;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = index === lastIndex ? 0 : index + 1;
        listItems[newIndex].focus();
        handleSelectList(lists[newIndex].id);
        break;
      case 'ArrowLeft':
        newIndex = index === 0 ? lastIndex : index - 1;
        listItems[newIndex].focus();
        handleSelectList(lists[newIndex].id);
        break;
      case 'Home':
        listItems[0].focus();
        handleSelectList(lists[0].id);
        break;
      case 'End':
        listItems[lastIndex].focus();
        handleSelectList(lists[lastIndex].id);
        break;
      case 'Enter':
      case ' ':
        handleSelectList(lists[index].id);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new">リスト新規作成</Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`}>選択中のリストを編集</Link>
              </p>
            </div>
          </div>
          <ul className="list-tab" role="tablist" aria-label="タスクリスト" ref={listTabRef}>
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                <li
                  key={key}
                  className={`list-tab-item ${isActive ? 'active' : ''}`}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  aria-controls={`tasks-panel-${list.id}`}
                  id={`list-tab-${list.id}`}
                  onClick={() => handleSelectList(list.id)}
                  onKeyDown={(e) => handleKeyDown(e, key)}
                >
                  {list.title}
                </li>
              );
            })}
          </ul>
          <div
            className="tasks"
            role="tabpanel"
            id={`tasks-panel-${selectListId}`}
            aria-labelledby={`list-tab-${selectListId}`}
          >
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new">タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              <select onChange={handleIsDoneDisplayChange} className="display-select">
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks tasks={tasks} selectListId={selectListId} isDoneDisplay={isDoneDisplay} />
          </div>
        </div>
      </main>
    </div>
  );
};

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;

  // 残り時間を計算する関数
  const calculateRemainingTime = (limitDate) => {
    if (!limitDate) return null;

    const now = new Date();
    const limit = new Date(limitDate);
    const diff = limit - now;

    if (diff < 0) return '期限切れ';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `残り ${days}日 ${hours}時間 ${minutes}分`;
  };

  // 日時をフォーマットする関数
  const formatDateTime = (dateString) => {
    if (!dateString) return '期限なし';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  if (isDoneDisplay == 'done') {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => (
            <li key={key} className="task-item">
              <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link">
                {task.title}
                <br />
                {task.done ? '完了' : '未完了'}
                <br />
                期限: {formatDateTime(task.limit)}
              </Link>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => (
          <li key={key} className="task-item">
            <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link">
              {task.title}
              <br />
              {task.done ? '完了' : '未完了'}
              <br />
              期限: {formatDateTime(task.limit)}
              <br />
              {task.limit && calculateRemainingTime(task.limit)}
            </Link>
          </li>
        ))}
    </ul>
  );
};
