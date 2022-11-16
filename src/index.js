import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'

// 引用 google分析
import ReactGA from 'react-ga'
ReactGA.initialize('G-F4N0NX0YNJ')
ReactGA.pageview(window.location.pathname + window.location.search)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <HashRouter>
        <App />
    </HashRouter>
)
