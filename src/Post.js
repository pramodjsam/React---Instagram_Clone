import React,{useEffect,useState} from 'react';
import firebase from 'firebase';
import Avatar from '@material-ui/core/Avatar';
import {db} from "./firebase";
import './Post.css'

const Post = ({postId,user,username,caption,imageUrl}) =>{
	const [comments,setComments] = useState([]);
	const [comment,setComment] = useState("");

	useEffect(()=>{
		let unsubscribe;
		if(postId){
			unsubscribe = db
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.onSnapshot(snapshot=>(
					setComments(snapshot.docs.map(doc=> doc.data()))
					))
		}
		return ()=>{
			unsubscribe();
		}
	},[postId])

	const postComment = (e) =>{
		e.preventDefault();
		db.collection("posts").doc(postId).collection('comments').add({
			text:comment,
			username:user.displayName,
			timestamp:firebase.firestore.FieldValue.serverTimestamp()
		})
		setComment("");
	}

	return(
		<div className='post'>
		<div className='post__header'>
			<Avatar className='post__avatar'
			alt="Remy Sharp" 
			src="/static/images/avatar/1.jpg" />
			<h3>{username}</h3>
		</div>
			

			<img className='post__image'
			 src={imageUrl} alt=""/>

			<h4 className='post__text'><strong>{username}</strong>: {caption}</h4>
			<div className='post__comments'>
				{comments.map(comment=>(
					<p>
						<strong>{comment.username}</strong> {comment.text}
					</p>
				))}
			</div>
			{user ? (
					<form className='post__commentBox'>
						<input 
						className='post__input'
						placeholder='Add a comment...'
						value={comment}
						onChange={e=>setComment(e.target.value)}
						type="text"/>
						<button type='submit'
						disabled={!comment}
						className='post__button'
						onClick={postComment}
						>Post</button>
					</form>
				) : (
					<p className='post__logouttext'>Login to comment</p>
				)}
			
		</div>
	)
}

export default Post;