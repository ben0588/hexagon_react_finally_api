import React from 'react';
import { RiDeleteBack2Fill }  from 'react-icons/ri';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';


function TestLi ({value,title,index,userToken,toast,newTodoList,setNewTodoList,options}){
    
    // 單一刪除按鈕元件
    const deleteList =(id)=>{
        // 先確認進入的id值是否跟list對應的相同
        // console.log(id)

        const deleteApi = `https://todoo.5xcamp.us/todos/${id}`;
        const config = {
            headers:{
                'Authorization':userToken,
                'Content-Type':'application/json'
            }
        } 
        axios.delete(deleteApi,config)
        .then(response=>{
            // // 先判斷近來是否成功
            // console.log(response)
            // // 取點擊時送進來的ID
            // console.log(id) 

            toast(`刪除待辦事項成功 !`,options)
            // 把刪除的id以外的重新放到陣列中
            let item = newTodoList.filter((value)=>value.id != id); 
            // 成功後在次呼叫更新localStorage的newList資料
            let jsonList = JSON.stringify(item);
            localStorage.setItem('listData',jsonList);
            setNewTodoList(item)
        }) 
        .catch((error)=>{
            toast.error(`刪除代辦事項失敗 !`,options)
        })
    }


    // 核選時，呼叫api更新todoList資料，並且更新 newTodoList陣列資料
    const changeListState = (id)=>{
        const data = id;
        const toggleApi = `https://todoo.5xcamp.us/todos/${data}/toggle`;
        const config = {
            headers:{
                'Authorization':userToken,
                'Content-Type':'application/json'
            }
        };
        axios.patch(toggleApi,data,config)
        .then(response=>{
            // 呼叫api更改狀態成功後
            let newState = response.data.completed_at;
            // 將原資料放入相同id的新陣列，更新勾選狀態
            let newList = newTodoList.map((value)=>{
                return value.id == id ? {id:value.id,content:value.content,completed_at:newState}:value
            })
            setNewTodoList(newList);
            // 成功後在次呼叫更新localStorage的newList資料
            let jsonList = JSON.stringify(newList);
            localStorage.setItem('listData',jsonList);
            
        })
        .catch((error)=>{
            toast.error(`資料不存在，請聯繫我們 !`,options)
        })
    }

    
    return (
        <ul className="todoList_item">
        <li key={value.id}>
            <label className="todoList_label">
                <input className='todoList_input' type="checkbox" id="checkState"
                // 如果資料狀態是true才會打勾
                checked={value.completed_at? "checkbox":''}
                // 當選擇時更新List的狀態成True，把id值待進去做判斷
                onChange={()=>{changeListState(value.id)}}/>
                <span>{value.content}</span>
                
                
            </label>
            <div className='icon_span'>
                <a className="icon2" onClick={()=>{deleteList(value.id)}} >
                    <RiDeleteBack2Fill  size={ '25px'}/>
                </a>
            </div>
        </li>
        </ul>

        
    )
}

export default TestLi;