import { defineStore } from 'pinia'
import {ref} from "vue";


export const useNotificationStore = defineStore('notification',()=>{
    const message = ref('')
    const type = ref('info')
    const visible = ref(false)

    const show = (msg:string,msgType='info',duration = 3000)=>{
         message.value = msg;
         type.value = msgType;
         visible.value = true;
        setTimeout(() => (visible.value = false), duration)
    }

    return { message, type, visible, show }
})