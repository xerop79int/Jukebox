bpm = int(89)  # Default BPM is 120
song_duration = '3:46'  # Default song duration is 240 seconds
song_duration = sum(x * int(t) for x, t in zip([1, 60, 3600], reversed(song_duration.split(":"))))
num_lines = int(20)  # Default number of lines is 20

# Your calculation logic here (similar to the JavaScript function)
SCROLL_SPEED = 1
LINE_DURATION = song_duration / num_lines
BEAT_DURATION = 60 / bpm
BEATS_PER_LINE = LINE_DURATION / BEAT_DURATION
auto_scroll_value = BEATS_PER_LINE * SCROLL_SPEED
print(auto_scroll_value)