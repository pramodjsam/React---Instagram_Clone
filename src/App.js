import React,{useState, useEffect} from 'react';
import Post from "./Post";
import {db,auth} from "./firebase"
import {Button, Input} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed"
import './App.css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = function() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignIn,setOpenSignIn] = useState(false);
  const [username,setUsername]=useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [user,setUser] = useState(null);

    useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged((authUser)=>{
        if(authUser){
          //User has logged in
          setUser(authUser);
          // if(authUser.displayName){

          // }else{
          //   return authUser.updateProfile({
          //     displayName:username
          //   })
          // }
        }else{
          //User has logged out
          setUser(null);
        }
      })
      return () =>{
        unsubscribe()
      }
    },[user,username])

    useEffect(()=>{
      db.collection("posts").orderBy("timestamp","desc").onSnapshot(snapshot=>(
        setPosts(snapshot.docs.map(doc=> ({id:doc.id,post:doc.data()})))
       ))
    },[])

    const signUp = (e) =>{
      e.preventDefault();
      auth.createUserWithEmailAndPassword(email,password)
        .then((authUser)=> authUser.user.updateProfile({displayName:username}))
        .catch(error=> alert(error.message))
      setOpen(false);
    }
     
     const signIn = (e) =>{
       e.preventDefault();

       auth
         .signInWithEmailAndPassword(email,password)
          .catch((error)=>alert(error.message))

       setOpenSignIn(false);
     }
  return (
    <div className="app">
     <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
          <center>
             <img className='app__headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
        </center>
             <Input 
             value={username} onChange={(e)=>setUsername(e.target.value)}
             type='text' placeholder='username' />
              <Input 
             value={email} onChange={(e)=>setEmail(e.target.value)}
             type='text' placeholder='email' />
              <Input 
             value={password} onChange={(e)=>setPassword(e.target.value)}
             type='password' placeholder='password' />
             <Button type='submit' onClick={signUp}>SignUp</Button>
          
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
          <center>
             <img className='app__headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
        </center>
            <Input 
             value={email} onChange={(e)=>setEmail(e.target.value)}
             type='text' placeholder='email' />
              <Input 
             value={password} onChange={(e)=>setPassword(e.target.value)}
             type='password' placeholder='password' />
             <Button type='submit' onClick={signIn}>Sign In</Button>          
          </form>
        </div>
      </Modal>
      <div className='app__header'>
        <img className='app__headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
        {user ? (
          <Button onClick={()=>auth.signOut()}>Logout</Button>
        ) : (
          <div className='app__loginContainer'>
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      
      <div className='app__posts'>
      <div className='app__postsLeft'>
         {posts.map(({id,post})=>(
         <Post key={id} user={user} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))}
      </div>
      <div className='app__postsRight'>
        <InstagramEmbed
        url='https://www.instagram.com/p/CEcB__WgRn8/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      </div>
      </div>
       

        {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ):(
        <h3>Sorry,you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
