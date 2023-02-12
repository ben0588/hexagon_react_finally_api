import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState, useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { RiEyeFill } from 'react-icons/ri'
import { RiEyeOffFill } from 'react-icons/ri'

import todoListImg from '../images/todoListImg.jpg'

function Register() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
    } = useForm()
    const navigate = useNavigate() // 用來跳轉網只用
    const onePassword = watch('pwd') // 取得useForm密碼欄位1
    const twoPassword = watch('pwd2') // 取得useForm密碼欄位2
    const [str1, setSer1] = useState('') // 取出useForm密碼欄位1 (檢查兩次密碼)
    const [str2, setSer2] = useState('') // 取出useForm密碼欄位2 (檢查兩次密碼)
    const [checkError, setCheckError] = useState([]) // 檢查不符合欄位數量
    const [iconShow, setIconShow] = useState(0) // 切換顯示密碼圖標
    const [passwordType, sePasswordType] = useState('password') // 切換密碼格式
    const [iconShow2, setIconShow2] = useState(0) // 切換顯示密碼2圖標
    const [passwordType2, sePasswordType2] = useState('password') // 切換密碼2格式

    // 提醒吐司樣式
    const options = {
        position: 'bottom-right',
        autoClose: 1500,
        hideProgressBar: false,
        newestOnTop: false,
        rtl: false,
        pauseOnHover: false,
        draggable: false,
        closeOnClick: false,
    }

    useEffect(() => {
        // 當兩次密碼都要大於等於6 才會比對兩次密碼是否相同
        if (onePassword?.length >= 6 && twoPassword?.length >= 6) {
            setSer1(onePassword)
            setSer2(twoPassword)
        }
    }, [onePassword, twoPassword, str1, str2, errors])

    // 註冊會員
    const userRegister = (data) => {
        // 當兩次密碼符合時才繼續執行
        if (data.pwd === data.pwd2) {
            const api = 'https://todoo.5xcamp.us/users'
            const password = data.pwd
            // 依照api要求規格傳送資料
            const json = {
                user: {
                    email: data.email,
                    nickname: data.nickname,
                    password: password,
                },
            }
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            axios
                .post(api, json, config)
                .then((response) => {
                    toast.success(
                        `歡迎您${response.data.nickname}，${response.data.message}，即將返回登入頁面`,
                        options
                    )
                    // alert(`歡迎您${response.data.nickname}，${response.data.message}，即將返回登入頁面`)
                    setTimeout(() => {
                        // 註冊成功才跳登入頁面
                        navigate('/')
                    }, 2500)
                })
                .catch((error) => {
                    toast.error(`${error.response.data.message}，${error.response.data.error[0]}，請再確認`, options)
                    // alert(`${error.response.data.message}，${error.response.data.error[0]}，請再確認`)
                })
        }
    }

    // 切換密碼名碼顯示
    const toggleBtn = () => {
        if (iconShow == 0) {
            // console.log('顯示隱碼')
            setIconShow(1)
            sePasswordType('text')
        }
        if (iconShow == 1) {
            // console.log('顯示名碼')
            setIconShow(0)
            sePasswordType('password')
        }
    }

    // 切換密碼2名碼顯示
    const toggleBtn2 = () => {
        if (iconShow2 == 0) {
            // console.log('顯示隱碼')
            setIconShow2(1)
            sePasswordType2('text')
        }
        if (iconShow2 == 1) {
            // console.log('顯示名碼')
            setIconShow2(0)
            sePasswordType2('password')
        }
    }

    return (
        <div id='signUpPage' className='bg-yellow'>
            <div className='conatiner signUpPage vhContainer'>
                <div className='side'>
                    <a href='#'>
                        <img className='logoImg' src='https://upload.cc/i1/2022/03/23/rhefZ3.png' alt='' />
                    </a>
                    <img className='d-m-n' src={todoListImg} alt='workImg' />
                </div>
                <div>
                    <form className='formControls' onSubmit={handleSubmit(userRegister)}>
                        <h2 className='formControls_txt'>註冊帳號</h2>
                        <label className='formControls_label' htmlFor='email'>
                            Email
                        </label>
                        <input
                            className='formControls_input'
                            type='text'
                            id='email'
                            name='email'
                            placeholder='請輸入 email'
                            {...register('email', {
                                required: { value: true, message: '此欄位不可留空' },
                                pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: '不符合 Email 規則' },
                            })}
                        />
                        <span>{errors.email?.message}</span>
                        <label className='formControls_label' htmlFor='nickname'>
                            您的暱稱
                        </label>
                        <input
                            className='formControls_input'
                            type='text'
                            name='nickname'
                            id='nickname'
                            placeholder='請輸入您的暱稱'
                            {...register('nickname', { required: { value: true, message: '此欄位不可留空' } })}
                        />
                        <span>{errors.nickname?.message}</span>
                        <label className='formControls_label' htmlFor='pwd'>
                            密碼
                            <i className='icon-show' onClick={toggleBtn}>
                                {iconShow == 0 ? <RiEyeOffFill size={'25px'} /> : <RiEyeFill size={'25px'} />}
                            </i>
                        </label>
                        <input
                            className='formControls_input'
                            type={passwordType}
                            name='pwd'
                            id='pwd'
                            placeholder='請輸入密碼'
                            {...register('pwd', {
                                required: { value: true, message: '此欄位不可留空' },
                                minLength: { value: 6, message: '密碼最少需要六位數' },
                            })}
                        />
                        <span>{errors.pwd?.message}</span>

                        <label className='formControls_label' htmlFor='pwd2'>
                            再次輸入密碼
                            <i className='icon-show' onClick={toggleBtn2}>
                                {iconShow2 == 0 ? <RiEyeOffFill size={'25px'} /> : <RiEyeFill size={'25px'} />}
                            </i>
                        </label>
                        <input
                            className='formControls_input username'
                            type={passwordType2}
                            name='pwd2'
                            id='pwd2'
                            placeholder='請再次輸入密碼'
                            {...register('pwd2', {
                                required: { value: true, message: '此欄位不可留空' },
                                minLength: { value: 6, message: '密碼最少需要六位數' },
                            })}
                        />
                        <span>
                            {errors.pwd2?.message
                                ? errors.pwd2?.message
                                : str1 == str2
                                ? ''
                                : '兩次密碼錯誤，請再次確認'}
                        </span>
                        <input
                            className='formControls_btnSubmit'
                            type='submit'
                            value='註冊帳號'
                            disabled={Object.entries(errors).length > 0 ? isDirty : !isDirty}
                            style={{
                                backgroundColor:
                                    Object.entries(errors).length > 0 || str1 !== str2 ? '#ADADAD' : '#333333',
                            }}
                        />
                        <Link className='formControls_btnLink' to='/'>
                            登入
                        </Link>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </div>
    )
}

export default Register
