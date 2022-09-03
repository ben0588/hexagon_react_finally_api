import React from 'react';
import { Routes, Route } from "react-router-dom";

/*

    所需要的頁面:
    1、登入頁面
    2、註冊帳號頁面
    3、待辦事項todoList
        3-1、無待辦事項實畫面顯示 

*/ 

// 登入頁面(當作首頁)
import Login from './components/login.jsx';
// 註冊頁面
import Register from './components/register.jsx';
// 待辦事項
import TodoList from './components/todoList.jsx';


function App() {
 
    return ( 
        <>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/todoList" element={<TodoList />}/>
            </Routes>

        </>
     );
}

export default App;


// 記錄時間:開始時間8/31 11:06開始  16停 11:35繼續