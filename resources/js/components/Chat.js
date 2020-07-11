
    import React, { Component } from 'react'
    import {
      Button,
      InputGroup,
      InputGroupAddon,
      Input,
      Container,
      Row,
      Col
    } from 'reactstrap';
import { connect }from 'react-redux';
import PropTypes from "prop-types";
import { isAuth, getDmUsers, getMessages, dmSelectAction, channelSelect } from '../actions/chatActions';
import { echoInit, sendMessage } from './utils/echoHelpers';
import ChatMessageList from './ChatMessageList';
import ChatDmUsersList from './ChatDmUserList';


    class Chat extends Component {

        state = {
          messages:[],
          message:"",
          users: [],
          allUsers: [],
          currUser:"",
          selectedChannel:""

      }

      static propTypes = {
        isAuth: PropTypes.func.isRequired,
        getDmUsers: PropTypes.func.isRequired,
        getMessages: PropTypes.func.isRequired,
        dmSelectAction: PropTypes.func.isRequired,
        channelSelect: PropTypes.func.isRequired,

        messages: PropTypes.array.isRequired,
        usersInRoom: PropTypes.array.isRequired,
        dmUsers: PropTypes.array.isRequired,
        message: PropTypes.object.isRequired,
        currUser: PropTypes.object.isRequired,
        selectedChannel: PropTypes.object.isRequired
,
      };


      constructor(props) {
        super(props);
        this.myToken = localStorage.getItem("LRC_Token");
        this.fakeGeneralChannel = { "id": 5, "type": "channel"};
        this.dmSelect = this.dmSelect.bind(this)

    }

      componentDidMount () {


          this.props.isAuth();

          echoInit(this.myToken);

          this.props.getDmUsers();

          this.channelSelect(this.fakeGeneralChannel);



      }

      messageList() {
        const messages = this.props.messages;
        // console.log(typeof(messages));
        const messagelist = messages.map((value, index) => {
          // console.log(value)
          if(value.status === true) {
            return <Col className="my-3" key={index} sm="6" md={{size: 8, offset: 3}}><strong>{value.user.name}</strong> has <span className="text-primary">{value.message}</span> the channel</Col>
          } else {
            return <Col key={index}><b>{value.user.name }  &lt; { value.user.email }  &gt;  :</b> <br></br> {value.message}</Col>
          }
        });

        return messagelist;
      }


      userList() {
        const users = this.props.usersInRoom;
        // console.log(typeof(users));

        const userList = users.map((value, index) => {
          console.log(value)
          return <li key={index}><b>{value.name }</b></li>
        });

        return userList;
      }

      allUserList() {
        console.log("CURRENT USER BELOW ");
        console.log(this.props.currUser);
        const users = this.props.dmUsers.filter(u => u.id !== this.props.currUser.id);
        // console.log(typeof(users));

        const userList = users.map((value, index) => {
          return <Col key={index}> <Button onClick={this.dmSelect.bind(this, value.id)} id={value.id} ><b>{value.name }</b></Button>
          <br></br>
          </Col>
        });

        return userList;
      }

      dmSelect(id){
        this.props.dmSelectAction(id)
      }

      channelSelect = (selectedChannel, event) => {
        if(event !== undefined) {
          event.stopPropagation();
        }
        this.props.channelSelect(selectedChannel);
      }

      onLogout = () => {

            const headers = {
              headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+this.myToken
              }
            };

            axios.get("/api/auth/logout", headers)
              .then((res) =>{
                if(res.status === 200) {
                  window.Echo.disconnect();
                  localStorage.removeItem("LRC_Token");
                  // this.setState({
                  //   redirect: true
                  // })
                  this.props.history.push("/login");
                 }
              })
              .catch((err) => {
              });
      }

      onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      };

      // Calls action to register user
      sendMessageWrapper = (e) => {
        e.stopPropagation();
        console.log(this.state.message);
        sendMessage(this.state.message, this.props.selectedChannel.id)
        this.setState({ message:'' });

      }

      render () {
        return (
          <div>
          <Container fluid="true">
             <Row>
            <Col xs="3">
              <h3>Channels</h3>
               <Col> <Button onClick={this.channelSelect.bind(this, this.fakeGeneralChannel)} id="5" key="5"><b> General</b></Button>
          <br></br>
          </Col>
                <h3>Direct Message</h3>
                <ChatDmUsersList dmUsers={this.props.dmUsers} currUser={this.props.currUser} dmSelect={this.dmSelect} />
          </Col>
              <Col xs="6">
                <h1>Chat Homepage</h1>
                <Button onClick={this.onLogout}>Logout</Button>
                    <ChatMessageList messages={this.props.messages}/>
                  <InputGroup>
                <Input onChange={this.onChange} id="message" value={this.state.message}name="message" />
                  <InputGroupAddon addonType="append"><Button onClick={this.sendMessageWrapper}>Send </Button></InputGroupAddon>
                </InputGroup>
              </Col>
              <Col xs="3">
                <h3>Users in this Room</h3>
                <ul>
                  {this.userList()}
                </ul>
              </Col>
            </Row>
          </Container>
          </div>
        )
      }
    }

    const mapStateToProps = (state) => ({ //Maps state to redux store as props

      authState: state.auth,
      messages:state.chat.messages,
      message:state.chat.message,
      usersInRoom: state.chat.usersInRoom,
      dmUsers: state.chat.dmUsers,
      currUser:state.chat.currUser,
      selectedChannel:state.chat.selectedChannel

    });
    export default connect(mapStateToProps, {isAuth, getDmUsers, getMessages,dmSelectAction, channelSelect})(Chat);