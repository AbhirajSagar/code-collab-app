'use client';
import { Editor } from "@monaco-editor/react";
import Peer from "peerjs";
import { useEffect,useState,useRef } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCopy, faFile, faPersonCircleQuestion, faSearch, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import AnimatedModal from "@/components/AnimatedModal";

export default function EditorPage()
{
    const searchParams = useSearchParams();
    
    const [workspaceName, setWorkspaceName] = useState('Untitled Project'); //Current Workspace Name
    const [peerId, setPeerId] = useState(''); //Your Peer Id
    const peerRef = useRef(null); //This is your own peer 
    const [connections, setConnections] = useState([]); //All clients
    const [code, setCode] = useState(''); //For storing actual written code..
    
    useEffect(() => 
    {
        if(peerRef.current === null)
        setUpHostPeer();
        
        return clearPeer;
    }, []);

    function clearPeer()
    {
        if(peerRef.current !== null)
        {
            peerRef.current.destroy();
            peerRef.current = null;
        }
    }

    function setUpHostPeer()
    {
        const workspaceNameParam = searchParams.get('name');
        workspaceNameParam && setWorkspaceName(workspaceNameParam);

        const peer = new Peer();
        peerRef.current = peer;

        peer.on('open', (id) => 
        {
            setPeerId(id);
            console.log('Peer connected with ID:', id);
        });

        peer.on('connection', (conn) =>
        {
            console.log('New connection from:', conn.peer);

            const messageToSend = getMessage();
            setConnections((prev) => [...prev, conn]);
            connections.forEach((con) => con.send(messageToSend));

            conn.on('data', (data) =>
            {
                console.log('Received data from peer:', data);
                handleReceivedData(data);
            });
        });
    }

    function getMessage()
    {
        const message = 
        {
            type: 'code',
            content: code
        }

        return message;
    }

    function handleReceivedData(data)
    {
        if(data.type === 'code')
        {
            setCode(data.content);
        }

        //can add other types of message and their respective action
        //for example
        // if(data.type === 'cursor')
        // {
        //     //handle cursor position update
        // }
    }

    function handleCodeSync(value)
    {
        setCode(value);
        const messageToSend = getMessage();

        connections.forEach((con) => con.send(messageToSend));
    }

    return (
        <div className="w-full h-[100vh] overflow-hidden">
            <EditorNavbar workspaceName={workspaceName} peerId={peerId}/>
            <div className="w-full h-full flex">
                <div className="w-full bg-amber-400 h-full">
                    <Editor height='100vh' width='100%' defaultLanguage='javascript' value={code} onChange={(v) => handleCodeSync(v)} theme='vs-dark'/>
                </div>
            </div>
        </div>
    );
}

function Sidebar()
{
    return (
        <div className="w-14 h-full flex flex-col items-center">
            <div className="cursor-pointer hover:bg-background-muted-dark w-full flex justify-center items-center h-14">
                <FontAwesomeIcon icon={faFile} className="text-3xl text-muted"/>
            </div>
            <div className="cursor-pointer hover:bg-background-muted-dark w-full flex justify-center items-center h-14">
                <FontAwesomeIcon icon={faSearch} className="text-3xl text-muted"/>
            </div>
        </div>
    );
}

function EditorNavbar({workspaceName, peerId})
{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setIsCopied] = useState(false);

    function copyWorkspaceId()
    {
        navigator.clipboard.writeText(`${peerId}@${encodeURIComponent(workspaceName)}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    return (
        <div className="w-full h-9 flex justify-center items-center relative">
            <h2 className="text-muted font-extrabold">{workspaceName}</h2>
            <FontAwesomeIcon icon={faShareAlt} onClick={() => setIsModalOpen(true)} className="text-muted absolute top-0 right-0 hover:bg-amber-600 hover:text-white transition-all duration-150 rounded-bl-2xl cursor-pointer p-2 bg-background-muted-dark aspect-square"/>
            <AnimatedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className='p-4 flex flex-col'>
                <h2 className="w-full text-muted font-semibold">Share your workspace</h2>
                <div className="w-full justify-between px-3 items-center flex h-10 mt-3 rounded bg-background-dark">
                    <h2 className="text-muted font-light text-sm">{peerId}@{encodeURIComponent(workspaceName)}</h2>
                    <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} onClick={() => copyWorkspaceId()} className={`${copied ? 'text-green-600' : 'text-muted'} p-2 hover:bg-background-muted-dark ${copied ? 'hover:text-green-400' : 'hover:text-white'} rounded cursor-pointer`}/>
                </div>
                <div className="h-24 w-full rounded my-2 bg-background-dark flex-1 justify-center items-center flex">
                    <div className="flex justify-center items-center w-full h-full flex-col gap-2">
                        <FontAwesomeIcon icon={faPersonCircleQuestion} className="w-full text-7xl text-muted"/>
                        <h2 className="text-center font-extrabold text-muted">No Connections</h2>
                    </div>
                </div>
                <div>
                    <button className="w-1/4 float-right bg-amber-600 hover:bg-orange-600 py-2 rounded cursor-pointer  text-white" onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
            </AnimatedModal>
        </div>
    );
}