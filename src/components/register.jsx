import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState,useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const { register, handleSubmit, watch, formState: { errors }} = useForm(); 
    const navigate = useNavigate(); // 用來跳轉網只用
    const onePassword = watch('pwd');  // 取得useForm密碼欄位1
    const twoPassword = watch('pwd2'); // 取得useForm密碼欄位2
    const [str1,setSer1] = useState('') // 取出useForm密碼欄位1 (檢查兩次密碼)
    const [str2,setSer2] = useState('') // 取出useForm密碼欄位2 (檢查兩次密碼)

    // 提醒吐司樣式
    const options = {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar:false,
        newestOnTop:false,
        rtl:false,
        pauseOnHover:false,
    };

    useEffect(()=>{
        // 當兩次密碼都要大於等於6 才會比對兩次密碼是否相同
        if (onePassword?.length >= 6 && twoPassword?.length >= 6){
            setSer1(onePassword)
            setSer2(twoPassword)
        }
    },[onePassword,twoPassword,str1,str2])

  
    // 註冊會員
    const userRegister = (data)=>{
        // 當兩次密碼符合時才繼續執行
        if (data.pwd === data.pwd2 ){
            const api = 'https://todoo.5xcamp.us/users';
            const password  = data.pwd;
            // 依照api要求規格傳送資料
            const json = {
                user:{
                    "email":data.email,
                    "nickname":data.nickname,
                    "password":password
                }
            }
            const config = {
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                }
            }
            axios.post(api,json,config)
            .then(response=>{
                toast.success(`歡迎您${response.data.nickname}，${response.data.message}，即將返回登入頁面`,options)
                // alert(`歡迎您${response.data.nickname}，${response.data.message}，即將返回登入頁面`)
                setTimeout(()=>{
                    // 註冊成功才跳登入頁面
                    navigate('/')
                },2500)
                }
            )
            .catch((error)=>{
                toast.error(`${error.response.data.message}，${error.response.data.error[0]}，請再確認`,options)
                // alert(`${error.response.data.message}，${error.response.data.error[0]}，請再確認`)
            })
            
            
        }
    }

    return ( 
        <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
            <div className="side">
                <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
                <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
            </div>
            <div>
                <form className="formControls" onSubmit={handleSubmit(userRegister)}>
                    <h2 className="formControls_txt">註冊帳號</h2>
                    <label className="formControls_label" htmlFor="email">Email</label>
                    <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" 
                    {...register('email',{required:{value:true,message:'此欄位不可留空'},pattern:{value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,message:'不符合 Email 規則'}})}
                    /><span>{errors.email?.message}</span>
                    <label className="formControls_label" htmlFor="nickname">您的暱稱</label>
                    <input className="formControls_input" type="text" name="nickname" id="nickname" placeholder="請輸入您的暱稱" 
                    {...register('nickname',{required:{value:true,message:'此欄位不可留空'}})}
                    /><span>{errors.nickname?.message}</span>
                    <label className="formControls_label" htmlFor="pwd">密碼</label>
                    <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼"
                    {...register('pwd',{required:{value:true,message:'此欄位不可留空'},minLength:{value:6,message:'密碼最少需要六位數'}})}
                    />
                    <span>{errors.pwd?.message}</span>
                    <label className="formControls_label" htmlFor="pwd2">再次輸入密碼</label>
                    <input className="formControls_input" type="password" name="pwd2" id="pwd2" placeholder="請再次輸入密碼" 
                    {...register('pwd2',{required:{value:true,message:'此欄位不可留空'},minLength:{value:6,message:'密碼最少需要六位數'}})}
                    />
                    <span>
                    {errors.pwd2?.message ? errors.pwd2?.message
                    : str1 == str2 ? '':'兩次密碼錯誤，請再次確認' }</span>
                    <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />
                    <Link className="formControls_btnLink" to="/">登入</Link>
                </form>
            </div>
                <ToastContainer />
        </div>
    </div>
     );
}

export default Register;