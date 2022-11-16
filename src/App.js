import React, { useEffect } from 'react'
// 新增 useLocation 使用位置
import { Routes, Route, useLocation } from 'react-router-dom'
/*
    所需要的頁面:
    1、登入頁面
    2、註冊帳號頁面
    3、待辦事項todoList
        3-1、無待辦事項實畫面顯示 

*/
// 登入頁面(當作首頁)
import Login from './components/login'
// 註冊頁面
import Register from './components/register'
// 待辦事項
import TodoList from './components/todoList'

// 引用 react-ga ( google 分析 只支持 3 代 UA-XXX開頭 )
// import ReactGA from 'react-ga'

// 測試 react-ga4 ( G-XXX開頭 )
import ReactGA from 'react-ga4'

function App() {
    const location = useLocation()

    useEffect(() => {
        // 3 代設定
        // ReactGA.initialize('UA-249718443-1')
        // ReactGA.pageview(window.location.pathname + window.location.search)

        // 4 代測試
        ReactGA.initialize('G-F4N0NX0YNJ')
        ReactGA.send({ hitType: 'pageview', page: location.pathname })
    }, [location])
    // console.log(location)
    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/todoList' element={<TodoList />} />
            </Routes>
        </>
    )
}

export default App
