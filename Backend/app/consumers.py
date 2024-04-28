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
    
    async def sending_data_file_response(self, event):
        data =  event['data']
        await self.send(text_data=json.dumps(data))

class BandLeaderUploadConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the group for the consumer
        await self.channel_layer.group_add('bandleader_upload', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when the WebSocket connection is closed
        await self.channel_layer.group_discard('bandleader_upload', self.channel_name)

    async def receive(self, text_data):
        print(text_data)
        pass
    
    async def sending_data_file_response(self, event):
        data =  event['data']
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
        measure = event['measure']
        beat = event['beat']
        data = {'scroll': scroll, 'measure': measure, 'beat': beat}
        await self.send(text_data=json.dumps(data))
    
    async def send_playlist(self, event):
        playlist = {'playlist': event['playlist']}
        await self.send(text_data=json.dumps(playlist))
    
    async def send_metronome(self, event):
        print('Sending metronome')
        metronome = {'metronome': event['displaymetronome']}
        await self.send(text_data=json.dumps(metronome))


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
    