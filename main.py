import pytube

def download_thumbnail(url):
    # Create a YouTube object with the video URL
    youtube = pytube.YouTube(url)

    # Get the video thumbnail URL
    thumbnail_url = youtube.thumbnail_url

    # Download the thumbnail
    pytube.request.urlopen(thumbnail_url)
    thumbnail_data = pytube.request.urlopen(thumbnail_url).read()

    # Save the thumbnail to a file
    with open('thumbnail.jpg', 'wb') as file:
        file.write(thumbnail_data)

with open('set_list.txt', 'r') as f:
    for line in f:
        data = line.strip().split('-')
        try:
            number = data[0]
            name = data[1]
            artist = data[2]
            year = data[4]
            genre = data[5]
            duration = data[9]
            cover = data[-1]
            print(number, name, artist, year, genre, duration, cover)

        except:
            pass

video_url = 'https://music.youtube.com/watch?v=xC6MrVhnxCA'
download_thumbnail(video_url)


