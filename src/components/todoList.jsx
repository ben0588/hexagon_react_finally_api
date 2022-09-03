import React from 'react';
import { useEffect,useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddTodoList from './addTodoList';
import TestLi from './TestLi';
import errorImg from '../images/empty.png';
import { set } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import errorSrc from '../images/error.jpg';

import { sha256, sha224 } from 'js-sha256'; //加密用

function TodoList() {
    const navigate = useNavigate(); // 跳轉頁面
    const [userToken,setUserToken] = useState('');  // 存放userToken
    const [nickname,setNickname] = useState('')     // 存放會員名稱
    const [email,setEmail] = useState(''); // 判斷會員email資料
    const [newTodoList,setNewTodoList] = useState([]);  // 存放新的陣列資料
    const [toggleState,setToggleState] = useState(1); // 切換路由分頁的狀態碼
    const MySwal = withReactContent(Swal) // 建立跳窗物件

    // 點擊分頁時更改分頁狀態碼
    const getToggle =(e)=>{
        setToggleState(e);
    }

    // 提示吐司樣式設定
    const options = {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar:false,
        newestOnTop:false,
        rtl:false,
        pauseOnHover:false,
    };

    // 區分完全、待完成、已完成列表 ( 不動到原陣列 )
    const newList = toggleState == 1 ? newTodoList 
        // 將原陣列中狀態是false的返回
        : toggleState == 2 ? newTodoList.filter((value)=>value.completed_at == null) 
        // 將原陣列中狀態是true的返回
        : newTodoList.filter((value)=>value.completed_at != null) 

    // 清除"已完成"項目
    const deleteAllOkList=()=>{
        // 取出已完成的
        let finishList = newTodoList.filter((value)=>value.completed_at != null);

        // 篩選已完成的id出來呼叫刪除api
        finishList.forEach((value)=>{
            const id = value.id;
            // 呼叫刪除API涵式  
            deleteTodoFn(id)
        })
           
    }

    // 清除"所有已完成項目" ( 點擊清除已完成項目時觸發 )
    const deleteTodoFn =(id)=>{
        MySwal.fire({
            title: '刪除所有已完成項目?',
            text: "確認後將會進行刪除",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '確認',
            cancelButtonText: '取消',
          })
          .then((result) => {
            // console.log(result)
            // 點擊確認才執行登出
            if (result.isConfirmed) {
        // console.log(id) // id取成功後在執行以下
        const deleteApi = `https://todoo.5xcamp.us/todos/${id}`
        const config = {
            headers:{
                'Authorization':userToken,
                'Content-Type':'application/json'
            }
        } 
        axios.delete(deleteApi,config)
        .then(response=>{
            // 刪除成功後，取未完成的更新新陣列中
            let undoneList = newTodoList.filter((value)=>value.completed_at == null);
            setNewTodoList(undoneList)
            // 更新localStorage，防止重新整理後出現列表順序不同
            let jsonList = JSON.stringify(undoneList)
            localStorage.setItem('listData',jsonList);
            // console.log('API刪除資料成功，已更新localStorage & 畫面更新')
        })
        .catch((error)=>{})
        }})
    }

    // 會員登出
    const signOut =  (e)=>{
        MySwal.fire({
            title: '確定登出?',
            text: "確認後返回到登入頁面",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '登出',
            cancelButtonText: '取消',
          })
          .then((result) => {
            // console.log(result)
            // 點擊確認才執行登出
            if (result.isConfirmed) {
                const signOutApi = 'https://todoo.5xcamp.us/users/sign_out';
                const config = {
                    headers:{
                        'Authorization':userToken,
                        'Content-Type':'application/json'
                    }
                }
                 axios.delete(signOutApi,config)
                .then(response=>{
                // 登出成功之後，清除localStorage紀錄，傳送陣列次序
                    // 把最新listData的紀錄取出來
                    let listData = localStorage.getItem('listData');
                    let jsonList = JSON.parse(listData);
                    // 把index、id值紀錄
                    let newEmail = sha256(email);
                    let sequenceList = [newEmail];
                    jsonList.forEach((value,index)=>{
                        sequenceList.push({
                            index:index,
                            id:value.id
                        })
                    })
                    // 放入 localStorage 保存該會員的歷史序列 ( 否則會重製順序 )
                    let newLocalIndex = JSON.stringify(sequenceList);
                    localStorage.setItem(`${newEmail}`,newLocalIndex)

                    localStorage.removeItem('userToken');
                    localStorage.removeItem('nickname');
                    localStorage.removeItem('email');
                    localStorage.removeItem('listData');
                    
                    Swal.fire(
                        '登出成功!',
                        '歡迎再次訪問',
                        'success',
                        // 跳轉頁面夾帶資料
                        navigate('/')
                    )
                    
                })
                .catch((error)=>{
                    alert(`${error.response.data.message}，請聯繫客服人員`)
                })
           
            }
          })
    }

    // 從localStorage取出userToken、nickname，用來判斷是否在登入狀態
    useEffect(()=>{
        let newToken = localStorage.getItem('userToken');
        let newNickname = localStorage.getItem('nickname');
        let newEmail = localStorage.getItem('email');
        let listData = localStorage.getItem('listData');
        setUserToken(newToken)
        setNickname(newNickname)
        setEmail(newEmail)
        setNewTodoList(JSON.parse(listData))
    },[toggleState])

    console.log(newTodoList)

    return ( 
        <div>
    {userToken ?  <div id="todoListPage" className="bg-half">
                <nav>
                <h1><Link to="/">ONLINE TODO LIST</Link></h1>
                <ul>
                    <li className="todo_sm"><span>{nickname? nickname:'尚未登入成功'}的代辦</span></li>
                    <li><a onClick={signOut}>登出</a></li>
                </ul>
            </nav>
            <div className="conatiner todoListPage vhContainer">
                <div  className="todoList_Content">
                    <AddTodoList 
                    userToken={userToken}
                    options={options}
                    newTodoList={newTodoList}
                    setNewTodoList={setNewTodoList}    
                    /> 

                    {newTodoList.filter((value)=>value.completed_at == null ).length > 0  ?  <div className="todoList_list">
                        <ul className="todoList_tab">
                            <li><a  onClick={()=>{getToggle(1)}}  className={toggleState == 1 ? 'active':'undefined'}>全部</a></li>
                            <li><a  onClick={()=>{getToggle(2)}}  className={toggleState == 2 ? 'active':'undefined'}>待完成</a></li>
                            <li><a  onClick={()=>{getToggle(3)}}  className={toggleState == 3 ? 'active':'undefined'}>已完成</a></li>
                        </ul>

                        <div className="todoList_items">   
                    
                            {newList.map((value,index)=>{
                                return <TestLi key={index} 
                                index={index}
                                value={value}  
                                userToken={userToken}  
                                toast={toast} 
                                newTodoList={newTodoList}
                                setNewTodoList={setNewTodoList} 
                                options={options}          
                                /> })}
                                    

                            <div className="todoList_statistics">
                            <p>{newTodoList.filter((value)=>!value.completed_at).length >0 ? newTodoList.filter((value)=>!value.completed_at).length + ' 個待完成項目':'目前尚無代辦事項'}</p>
                                <a onClick={deleteAllOkList}>清除已完成項目</a>
                            </div>
                        </div>

                    </div>:<div className="todoList_no_data" >
                        <div className='todoList_no_h1'>
                            <h1 >目前無代辦事項</h1>
                        </div>
                        
                        <div >
                            <img className='todoList_no_img' src={errorImg}  alt="" /> 
                        </div>
                            
                    </div>}
                    
                </div>
                    <ToastContainer />
                </div>
                </div>:<div className="todoList_error_data" >
                        <div className='todoList_error_img' >
                            <img style={{width:'35%'}}src={errorSrc}  alt="" /> 
                        </div>
                        <div className='todoList_error_h1'>
                            <h1 >您尚未登入，無權限訪問此頁面！ </h1>
                        </div>
                        <div className='todoList_error_a'>
                            <Link to="/">前往登入頁</Link>
                        </div>
                    </div>}
        
        </div>
       
     );
}

export default TodoList;