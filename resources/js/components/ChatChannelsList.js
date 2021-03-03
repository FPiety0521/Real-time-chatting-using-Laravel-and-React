import React, {useState} from "react";
import {Collapse , Button, CardBody, Card, Col } from "reactstrap";
import CreateChannelModal from "./CreateChannelModal";

export const ChatChannelsList = props => {
    const channels = props.channels;

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    // console.log(typeof(channels));
    const { channelSelect } = props;
    console.log("in channels list");
    console.log(channels);
    const channelList = channels.map((value, index) => {
        return (
            <div className="channelElement" key={index}>
                <Button
                    color="link"
                    onClick={() =>
                        channelSelect(
                            value.id,
                            value.name,
                            value.desc,
                            value.owner_id,
                            value.owner
                        )
                    }
                    id={value.id}
                >
                    <b>{value.name}</b>
                </Button>
                <br></br>
            </div>
        );
    });

    return (
        <div className="sidepaneParentChannel">
           
            <Button color="white" className="sidepaneParentButton" onClick={toggle} >
            <h3>Channels { !isOpen ? <i class="fas fa-chevron-down"></i> : <i class="fas fa-chevron-up"></i>}</h3>
    </Button>
    <Collapse  isOpen={isOpen}>
    <div className="sidepaneChannel">
                <div>
                <CreateChannelModal buttonLabel={"+ Create New Channel"} />
                <br></br>
                    {" "}
                    <Button
                        color="link"
                        onClick={() =>
                            channelSelect(
                                5,
                                "General",
                                "A public channel where all users can chat"
                            )
                        }
                        id="5"
                        key="5"
                    >
                        <b> General</b>
                    </Button>
                    {channelList}
                </div>
            </div>
    </Collapse >
            
        </div>
    );
};

export default ChatChannelsList;
