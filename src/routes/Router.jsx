import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';
import { SignIn } from '../pages/SignIn';
import { NewTask } from '../pages/NewTask';
import { NewList } from '../pages/NewList';
import { EditTask } from '../pages/EditTask';
import { SignUp } from '../pages/SignUp';
import { EditList } from '../pages/EditList';

export const Router = () => {
  console.log('Router component rendering'); // デバッグ用
  // 認証状態を使用しないように変更
  // const auth = useSelector((state) => state.auth.isSignIn);
  // console.log('Auth state:', auth); // 認証状態をデバッグ

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* {auth ? (
          <> */}
        {/* 認証チェックを削除し、すべてのルートを直接定義 */}
        <Route path="/" element={<Home />} />
        <Route path="/task/new" element={<NewTask />} />
        <Route path="/list/new" element={<NewList />} />
        <Route path="/lists/:listId/tasks/:taskId" element={<EditTask />} />
        <Route path="/lists/:listId/edit" element={<EditList />} />
        {/* </>
        ) : (
          <Route path="*" element={<Navigate to="/signin" replace />} />
        )} */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
