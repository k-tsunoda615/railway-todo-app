import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
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
  const auth = useSelector((state) => state.auth.isSignIn);
  console.log('Auth state:', auth); // 認証状態をデバッグ

  return (
    <BrowserRouter basename="/">
      <Switch>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        {auth ? (
          <>
            <Route exact path="/" component={Home} />
            <Route exact path="/task/new" component={NewTask} />
            <Route exact path="/list/new" component={NewList} />
            <Route exact path="/lists/:listId/tasks/:taskId" component={EditTask} />
            <Route exact path="/lists/:listId/edit" component={EditList} />
          </>
        ) : (
          <Redirect to="/signin" />
        )}
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};
