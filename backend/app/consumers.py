from channels.generic.websocket import AsyncWebsocketConsumer
import json

class BandLeaderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the group for the consumer
        await self.channel_layer.group_add('bandleader_frontend', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when the WebSocket connection is closed
        await self.channel_layer.group_discard('bandleader_frontend', self.channel_name)

    async def receive(self, text_data):
        print(text_data)
        pass

    async def send_message(self, text_data):
        pass

    async def send_data(self, event):
        print('Data sent to bandleader')
        # Send data to the group
        data = event['data']
        await self.send(text_data=json.dumps(data))

class BandMemberConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the group for the consumer
        await self.channel_layer.group_add('bandmember_frontend', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when the WebSocket connection is closed
        await self.channel_layer.group_discard('bandmember_frontend', self.channel_name)

    async def receive(self, text_data):
        print(text_data)
        pass

    async def send_message(self, text_data):
        pass

    async def send_data(self, event):
        print('Sending data')
        # Send data to the group
        scroll = event['scroll']
        await self.send(text_data=json.dumps(scroll))
    
    async def send_playlist(self, event):
        playlist = {'playlist': event['playlist']}
        await self.send(text_data=json.dumps(playlist))


class CustomerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the group for the consumer
        await self.channel_layer.group_add('customer_frontend', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when the WebSocket connection is closed
        await self.channel_layer.group_discard('customer_frontend', self.channel_name)

    async def receive(self, text_data):
        print(text_data)
        pass

    async def send_message(self, text_data):
        pass

    async def send_data(self, event):
        # Send data to the group
        data = event['data']
        await self.send(text_data=json.dumps(data))
        
    
    async def send_playlist(self, event):
        playlist = {'playlist': event['playlist']}
        await self.send(text_data=json.dumps(playlist))