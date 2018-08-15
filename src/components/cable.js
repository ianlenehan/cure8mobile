import React from 'react'
import { View } from 'react-native'
import { ActionCable } from 'react-actioncable-provider'

const Cable = ({ conversations, handleReceivedMessage }) => {
  return (
    <View>
      {conversations.map(conversation => {
        return (
          <ActionCable
            key={conversation.id}
            channel={{ channel: 'MessagesChannel', conversation: conversation.id }}
            onReceived={handleReceivedMessage}
          />
        )
      })}
    </View>
  );
};

export default Cable
