import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TodoList from './todoList';
import { sha256, sha224 } from 'js-sha256'; //加密用
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


import { RiEyeFill } from 'react-icons/ri';
import { RiEyeOffFill } from 'react-icons/ri';

function Login() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm(); // 表單驗證用
    const [iconShow,setIconShow] = useState(0); // 切換顯示密碼圖標
    const [passwordType,sePasswordType] = useState('password') // 切換密碼格式
    const navigate = useNavigate(); // 用來跳轉網只用
    const [userCheckToken,setUserCheckToken] = useState(''); // 讀取已存在的'userToken'，判斷頁面
    const [userCheckName,setUserCheckName] = useState('');   // 讀取已存在的'會員名稱'
    const [userCheckEmail,setUserCheckEmail] = useState(''); // 讀取已存在的'email'
    const [userCheckHistoryEmail,setUserCheckHistoryEmail] = useState(''); // 存歷史紀錄的email
    const MySwal = withReactContent(Swal) // 建立跳窗物件


    const getListApi ='https://todoo.5xcamp.us/todos'; // 取得 TodoList api

    // 顯示密碼用
    const showPassword =(e)=>{
        e.target.checked == true ? sePasswordType('text'): sePasswordType('password')
    }

    // 提醒吐司樣式
    const options = {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar:false,
        newestOnTop:false,
        rtl:false,
        pauseOnHover: false,
        draggable:false,
        closeOnClick: false,
    };

    // 會員登入 (無註冊或失敗則會跳錯誤)
    const loginCheck = async(data)=>{
        const loginApi = 'https://todoo.5xcamp.us/users/sign_in'; // 登入會員 api
        const checkData = {
            user:data
        }
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
       await axios.post(loginApi,checkData,config)
            .then(response=>{
                

            // 登入成功後將表頭的token存起來
            const getToken = response.headers.authorization;
            const getNickname = response.data.nickname;
            const getEmail = response.data.email;
            const success = response.data.message;

            // 將userToken & nickname 存入localStorage中
            localStorage.setItem('userToken',getToken);
            localStorage.setItem('nickname',getNickname);
            localStorage.setItem('email',getEmail)
            
            let checkOneEmail = sha256(getEmail); // 加密做第二次確認
            localStorage.setItem('checkName',checkOneEmail)

            // 取上次 (歷史紀錄中) 登出的會員及index、id碼
            let checkEmail = localStorage.getItem(`${checkOneEmail}`);
            let newCheckEmail = JSON.parse(checkEmail || '1234');
    
            // 與歷史紀錄中的e email紀錄相同，才會走歷史紀錄方式
            if (newCheckEmail[0] == checkOneEmail ){
                const config = {
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":getToken
                    }
                }
                axios.get(getListApi,config)
                .then(response=>{
                    // 原資料陣列
                    const list = response.data.todos;

                    // 再次處理陣列，把開頭email拿掉
                    let newEList = [];
                    newCheckEmail.forEach((value)=>{
                        newEList[value.index] = value.id
                    
                    })
                    // 移除未定義的值
                    let filterDeleteUndefined = newEList.filter(function(value){
                        return value !== undefined;
                    })

                    // 比對 歷史紀錄中的index、id 把新的放入對應的index資料中
                    let test = [];
                    filterDeleteUndefined.forEach((value1,index1)=>{
                        list.forEach((value)=>{
                            if ( value1 == value.id){
                                test[index1] = {...value}
                            }
                        })
                    })
                    const newList = JSON.stringify(test);

                    // 將核對後的陣列存入localStorage
                    localStorage.setItem('listData',newList);
                    // console.log('成功將原陣列存在暫存(有歷史紀錄)')

                    let timerInterval
                        Swal.fire({
                        title: '登入中',
                        html: '請稍後，檢查帳號中 <b></b>',
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                            const b = Swal.getHtmlContainer().querySelector('b')
                            timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                        }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            Swal.fire({
                                title: '登入成功!',
                                html: `歡迎 ${getNickname} ${success}，即將前往行事曆`,
                                timer: 1500,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                }).then((result) => {
                                /* Read more about handling dismissals below */
                                if (result.dismiss === Swal.DismissReason.timer) {
                                    // 跳轉頁面夾帶資料
                                    navigate('/todoList')
                                }
                            })
                        }
                    })

                }).catch((error)=>{
                    toast.error(`${error.response.data.message}，請再次確認帳號密碼`,options)
                    })
                }else {
                    // 歷史紀錄中沒有e的存在時，取全新的資料
                    const config = {
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":getToken
                        }
                    }
                    axios.get(getListApi,config)
                    .then(response=>{
                        // console.log('原資料',response)
                        // 原資料陣列
                        const list = response.data.todos;
                        // console.log(list)
                        const newList = JSON.stringify(list);
                        // 取新陣列暫存
                        // console.log('原陣列',newList)
                        localStorage.setItem('listData',newList);
                        // console.log('成功將原陣列存在暫存')
                        let timerInterval
                        Swal.fire({
                        title: '登入中',
                        html: '請稍後，檢查帳號中 <b></b>',
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                            const b = Swal.getHtmlContainer().querySelector('b')
                            timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                        }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            Swal.fire({
                                title: '登入成功!',
                                html: `歡迎 ${getNickname} ${success}，即將前往行事曆`,
                                timer: 1500,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                }).then((result) => {
                                /* Read more about handling dismissals below */
                                if (result.dismiss === Swal.DismissReason.timer) {
                                    // 跳轉頁面夾帶資料
                                    navigate('/todoList')
                                }
                            })
                        }
                    })
    
                    }).catch((error)=>{
                        toast.error(`${error.response.data.message}，請再次確認帳號密碼`,options)
                    })
                        
                }
                   

            }).catch((error)=>{
                toast.error(`${error.response.data.message}，請再次確認帳號密碼`,options)
                // alert(`${error.response.data.message}，請再次確認帳號密碼`)   
                }

    )}
    

    useEffect(()=>{
        let newToken = localStorage.getItem('userToken');
        let newNickname = localStorage.getItem('nickname');
        let newCheckEmail= localStorage.getItem('checkName');
        let newEmail = localStorage.getItem('email');
        setUserCheckToken(newToken)
        setUserCheckName(newNickname)
        setUserCheckHistoryEmail(newCheckEmail)
        setUserCheckEmail(newEmail)
        
    },[])

    // 登出按鈕
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
                        'Authorization':userCheckToken,
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
                    let newEmail = sha256(userCheckEmail);
                    let sequenceList = [newEmail];
                    jsonList.forEach((value,index)=>{
                        // console.log(value)
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
                        navigate(0)
                    )
                    
                })
                .catch((error)=>{
                    alert(`${error.response.data.message}，請聯繫客服人員`)
                })
           
            }
          })
    }

    
    // 切換密碼名碼顯示
    const toggleBtn = ()=>{
        if (iconShow == 0){
            // console.log('顯示隱碼')
            setIconShow(1)
            sePasswordType('text')
        }
        if (iconShow ==1 ){
            // console.log('顯示名碼')
            setIconShow(0)
            sePasswordType('password')
        }
    }

    return ( 
            <div id="loginPage" className="bg-yellow">
            <div className="conatiner loginPage vhContainer ">
                <div className="side">
                    <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
                    <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
                </div>
                <div>{!userCheckToken ? 
                        <form className="formControls" onSubmit={handleSubmit(loginCheck)}>
                        <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
                        <label className="formControls_label" htmlFor="email">Email</label>
                        <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" 
                        {...register('email',{ required:{value:true,message:'此欄位不可留空'},pattern:{value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,message:'不符合 Email 規則'}})}
                        /><span>{errors.email?.message}</span>
                        <label className="formControls_label" htmlFor="password">密碼
                            <i className="icon-show" onClick={toggleBtn}>{iconShow == 0? <RiEyeOffFill size={ '25px' }/>:<RiEyeFill  size={ '25px' }/>}</i>
                        </label>
                        <input className="formControls_input" type={passwordType} name="password" id="password" placeholder="請輸入密碼" 
                        {...register('password',{required:{value:true,message:'此欄位不可留空'},minLength:{value:6,message:'密碼最少需要六位數'}})}
                        />
                        <span>{errors.password?.message}</span>
                        <input className="formControls_btnSubmit" type="submit" value="登入" />
                        <Link className="formControls_btnLink" to="/register">註冊帳號</Link>
                        <br />
                       
                    </form> 
                    :  
                    
                    <form className="formControls">
                        <div style={{width:'115%',alignItems:'center',justifyContent:'center'}}>
                            <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
                            <label className="formControls_label" htmlFor="email"></label>
                        <input className="userNameShow" type="text" id="email" name="email" placeholder={`您好，尊敬的${userCheckName}會員，您目前為登入狀態`}  disabled/>
                        </div>
                        <input className="formControls_btnSubmit" type="button" value="登出"  onClick={signOut}/>
                        <Link className="formControls_btnLink" to="/todoList">返回待辦頁面</Link>
                        
                    </form>
                    
                    
                    }
                    
                </div>
                <ToastContainer pauseOnFocusLoss={false} />
            </div>
        </div>
     );
}

export default Login;