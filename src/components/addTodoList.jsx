import axios from 'axios';
import React from 'react';
import { useState,useEffect } from 'react';
import { IoIosAdd  } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';


function AddTodoList({userToken,options,newTodoList,setNewTodoList}) {
   
    const defaultText = '新增待辦事項' 
    const [placeholderValue,setPlaceholderValue] = useState(defaultText) // 輸入框預設浮水印
    const [addText,setAddText] = useState('') // 新增代辦事項標題
    

    // 新增list、newList清單
    const addListBtn =(e)=>{
        // 當傳進的值有包含空格，就限制不可新增
        if ( addText.trim() == '' && ' '){
            setAddText('');
            setPlaceholderValue('請重新輸入，不可送出空白');
        }
        else {
            // 傳送的參數沒有空格才可以執行新增
            const addTodoListApi = "https://todoo.5xcamp.us/todos"
            const config = {
                headers:{
                    'Authorization':userToken,
                    'Content-Type':'application/json'
                }
            }
            const addList = {
                todo:{
                    content:addText,
                }
            }
            axios.post(addTodoListApi,addList,config)
            .then(response=>{
                // 通過API的新增條件後，更新newList列表內容
                let newContent = response.data.content;
                let newId = response.data.id;
                // 更新newList
                let newList = [...newTodoList,{id:newId,content:newContent,completed_at:null}];
                setNewTodoList(newList)
                // 
                toast.success(`新增待辦事項成功 !`,options)
                // 更新暫存
                let jsonList = JSON.stringify(newList)
                localStorage.setItem('listData',jsonList);
                // 新增玩輸入框清空
                setAddText(''); 
                // 恢復浮水印預設文字
                setPlaceholderValue(defaultText); 
            })
            .catch((error)=>{
                toast.error(`新增待辦事項失敗，請聯繫我們 !`,options)
            })
        } 
    }
    

      return (
          <div>
          <div className="inputBox">
          <input type="text" id="setText" 
            className={placeholderValue == '請重新輸入，不可送出空白' ? 'checkStyle':''} 
            placeholder={placeholderValue == ' ' ? setPlaceholderValue('請重新輸入，不可送出空白'):placeholderValue} 
            value={addText} 
            onChange={(e)=>{setAddText(e.target.value)}} 
            />
                  <a className="icon1" onClick={(e)=>{addListBtn(e)}}  >
                    <IoIosAdd />
                  </a>
              </div>
              <ToastContainer style={{color:'red'}}/>
          </div>
      )
}

export default AddTodoList;