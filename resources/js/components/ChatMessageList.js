import React, { useEffect, useRef, useState }  from 'react'
import {
  Col,
  Row
} from 'reactstrap';
import Moment from 'react-moment';
import 'moment-timezone';
import { getAvatar } from './utils/echoHelpers';
import UserProfileModal from './UserProfileModal';
import NavbarText from 'reactstrap/lib/NavbarText';

function ChatMessageList(props) {

  // Equivalent of a Div ID in React, remains even across re-renders
  const bottomRef = useRef(null);



  //  function to scroll to dummy div places at the bottom of message list
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const messages = props.messages;
        // console.log(typeof(messages));

  const typingArray = props.typings;
  const typingArrayReady = typingArray.map((value,index) => {
    return <div className="typing-container">
     <img  src={'storage/'+value.user.avatar}></img>
         <div>
           <Col className="typingBubble" key={index}>
             <div className="dot"></div>
             <div className="dot"></div>
             <div className="dot"></div>
           </Col>
           <span>{value.user.name} is typing... </span> 
       </div>
    </div>
});

        const messagelist = messages.map((value, index) => {
          // console.log(value)
        //   if(value.type === 'typing') {
        //     const typingBubble = <div className="typing-container">
        //     <img  src={'storage/'+value.user.avatar}></img>
        //         <div>
        //           <Col className="chatNotUserMsg" key={index}>
        //             <div className="dot"></div>
        //             <div className="dot"></div>
        //             <div className="dot"></div>
        //           </Col>
        //           <span>{value.user.name} is typing... </span> 
        //       </div>
        //    </div>

        // setTypingArray([
        //     ...typingArray,
        //     typingBubble
        //   ]);


        //   }
          if(value.status === true) {
            return <Col className="systemMsg" style={{textAlign:"center"}} key={index} ><strong>{value.user.name}</strong> has <span className="text-primary">{value.message}</span> the channel</Col>
          } else {
            if(value.user.name !== props.currUser.name) {
              value.user.avatar = value.user.details.avatar;
              return (
                  <div className="msg-container">
                      <img src={"storage/" + getAvatar(value.user)}></img>

                      <div className="msg-container-inner">
                          <Col className="chatNotUserMsg" key={index}>
                              <span>
                                  <UserProfileModal
                                      currUser={props.currUser}
                                      user={value.user}
                                      addFriend={props.sendRequest}
                                      userDetailsClass="userDetailsMessage"
                                  />
                                  <br></br> {value.message}
                              </span>
                          </Col>
                          <Moment
                              date={value.created_at}
                              format="dddd, MMMM Do YYYY [at] h:mm A"
                          />
                      </div>
                  </div>
              );
            } else {
              value.user.avatar = value.user.details.avatar;

              return (
              <div className="user-msg-container">
              <div className="user-msg-container-inner">
                <Col className="chatUserMsg" key={index}>
                  <span>
                  {value.message}                
                  </span>
                  </Col>
                  <Moment date={value.created_at} format="dddd, MMMM Do YYYY [at] h:mm A"/>
              </div>
              <img  src={'storage/'+getAvatar(value.user)}></img>

             </div>
              )
            }
          }
        });

        // Runs on every re-render
        useEffect(() => {
          scrollToBottom();
        }, [messagelist]);

  return (
    <Row className="chatDisplay">
    {messagelist}
    {typingArrayReady}
    <div ref={bottomRef} />
    </Row>
  )
}

export default ChatMessageList;