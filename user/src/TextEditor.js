import {useCallback,useEffect , useState} from 'react'
import "quill/dist/quill.snow.css"
import Quill from 'quill'
import "./editor.css"
import {io} from 'socket.io-client'
import {useParams} from 'react-router-dom'

export default function TextEditor() {

    const {id} = useParams()
    console.log(id)
    const opt = [

        [{ 'font': [] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],        
        ['image', 'blockquote', 'code-block'],   
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      
        [{ 'indent': '-1'}, { 'indent': '+1' }],          
        [{ 'direction': 'rtl' }],                         
        [{ 'color': [] }, { 'background': [] }],          
        [{ 'align': [] }],
        ['clean']                                         
      ];

    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
      


    useEffect(() => {
        
        const sock =io("http://localhost:3001")
        setSocket(sock)

        return () => {
            sock.disconnect()
        }
    }, [])

    useEffect(() =>{
        if(socket == null || quill === null){
            return
        }
        socket.on("load",document =>{
            quill.setContents(document)
            quill.enable()
        })
        socket.emit("ID",id)
    },[socket ,quill,id])

    useEffect(() =>{
        if(socket == null || quill === null){
            return
        }
        const handler = (delta, oldDelta , source) => {
            if(source !== 'user') {
                return
            }
            socket.emit("changes",delta)
        }
        quill.on("text-change" , handler)
        return ()=> {
            quill.off("text-change" , handler)
        }
    },[socket ,quill])

    useEffect(() =>{
        if(socket == null || quill === null){
            return
        }
        const handler = (delta) => {
            quill.updateContents(delta)
        }
        socket.on("receive" , handler)
        return ()=> {
            socket.off("receive" , handler)
        }
    },[socket ,quill])

    const containerRef = useCallback(
        (cont) => {
            if(cont == null) return
            cont.innerHTML = ""
            const editor  = document.createElement("div")
            cont.append(editor)
            const q  = new Quill(editor , { theme : "snow" , modules : {
                toolbar : opt
            }})
            setQuill(q)
        
        },[],
    )




    return (
        <div className="container" ref={containerRef}>
            
        </div>
    )
}
