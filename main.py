# import pytube
# import requests
from time import sleep
# from pytube import YouTube
import requests
# import youtube_dl

# from pythumb import Thumbnail






# def download_youtube_thumbnail(video_url, video_id):
#     # Extract video ID from the URL
#     # video_id = video_url.split("v=")[1]

#     # # Construct the thumbnail URL
#     # thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

#     # Send a GET request to download the thumbnail
#     response = requests.get(video_url)

#     if response.status_code == 200:
#         filename = video_id + '.jpg'

#         # Save the thumbnail to disk
#         with open('./thumbnail/'+filename, "wb") as f:
#             f.write(response.content)
        
#         print("Thumbnail downloaded successfully!")
#     else:
#         print("Failed to download thumbnail.")

def download_youtube_music_thumbnail(video_url, output_file):
    output_file = "./thumbnail/" + output_file + '.jpg'
    try:
        video_id = video_url.split("=")[-1]
        thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
        response = requests.get(thumbnail_url)
        response.raise_for_status()
        with open(output_file, "wb") as file:
            file.write(response.content)
        print("Thumbnail downloaded successfully!")
    except Exception as e:
        print("Error:", str(e))

# def download_youtube_thumbnail(video_url, output_file):
#     try:
#         yt = YouTube(video_url)
#         thumbnail_url = yt.thumbnail_url
#         yt.streams.first().download(output_path=".", filename=output_file)
#         print("Thumbnail downloaded successfully!")
#     except Exception as e:
#         print("Error:", str(e))


with open('set_list.txt', 'r') as f:
    count = 0
    for line in f:
        data = line.strip().split(' - ')
        try:
            number = data[0]
            name = data[1]
            artist = data[2]
            year = data[4]
            genre = data[5]
            duration = data[9]
            cover = data[10].strip()

            video_id = cover.split('=')[1]

            download_youtube_music_thumbnail(cover, video_id)

        except Exception as e:
            print(e)
            pass



