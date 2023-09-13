from pdfminer.high_level import extract_text, extract_pages
from pdfminer.image import ImageWriter
from pdfminer.layout import LTImage
from PIL import Image
from pytesseract import pytesseract
from pytesseract import Output
import stat
import pandas as pd
import os
import shutil
import re
import sys

os.chmod('./tesseract.AppImage', stat.S_IRUSR | stat.S_IXUSR | stat.S_IWUSR | stat.S_IWGRP | stat.S_IRGRP | stat.S_IXGRP | stat.S_IWOTH | stat.S_IROTH | stat.S_IXOTH)

OUTPUT_DIR = 'output_dir/'

def write_pdf_to_images(pdf_file, folder_name):
	pages = extract_pages(pdf_file)
	iw = ImageWriter(OUTPUT_DIR + folder_name)
	for page_layout in pages:
		for element in page_layout:
			for image_layout in element:
				if isinstance(image_layout, LTImage):
					iw.export_image(image_layout)
	return OUTPUT_DIR + folder_name

def convert_image_to_text(image_file):
	path_to_tesseract = './tesseract.AppImage'

	image = Image.open(image_file)
	pytesseract.tesseract_cmd = path_to_tesseract

	# Passing the image object to image_to_string() function
	# This function will extract the text from the image
	text = pytesseract.image_to_data(image, config='-c preserve_interword_spaces=1',  output_type=Output.DICT)
	  
	df = pd.DataFrame(text)

	# clean up blanks
	df1 = df[(df.conf!='-1')&(df.text!=' ')&(df.text!='')]
	# sort blocks vertically
	sorted_blocks = df1.groupby('block_num').first().sort_values('top').index.tolist()
	text = ''
	for block in sorted_blocks:
	    curr = df1[df1['block_num']==block]
	    sel = curr[curr.text.str.len()>3]
	    char_w = (sel.width/sel.text.str.len()).mean()
	    prev_par, prev_line, prev_left = 0, 0, 0
	    
	    for ix, ln in curr.iterrows():
	        # add new line when necessary
	        if prev_par != ln['par_num']:
	            text += '\n'
	            prev_par = ln['par_num']
	            prev_line = ln['line_num']
	            prev_left = 0
	        elif prev_line != ln['line_num']:
	            text += '\n'
	            prev_line = ln['line_num']
	            prev_left = 0

	        added = 0  # num of spaces that should be added
	        if ln['left']/char_w > prev_left + 1:
	            added = int((ln['left'])/char_w) - prev_left
	            text += ' ' * added 
	        text += ln['text'] + ' '
	        prev_left += len(ln['text']) + added + 1
	    text += '\n'
	return text

def camel_case(title):
	stop_words = ['a', 'an', 'the', 'of', 'and', 'or']
	words = title.split(' ')
	index = 0
	while (index < len(words)):
		if (index == 0 or words[index].lower() not in stop_words):
			if (len(words[index]) <= 1):
				words[index] = words[index].upper()
			else:
				words[index] = words[index][0].upper() + words[index][1:]
		else:
			words[index] = words[index][0].lower() + words[index][1:]
		index += 1
	return ' '.join(words).strip()


def get_title(text):
	title = text.split('by')[0]
	transformed_title = title.replace('Chords', '').replace('chords', '').replace('Official', '').replace('official', '').strip()
	return camel_case(transformed_title)

def get_bpm(text):
	bpm = re.findall('BASIC PATTERN ([0-9]+) bpm', text)
	if (bpm is None or len(bpm) == 0):
		bpm = re.findall('WHOLE SONG ([0-9]+) bpm', text)
	return 'N/A' if bpm is None or len(bpm) == 0 else bpm[0]

def get_artist(text):
	header = text.split('|}')[0].split('by')
	return header[1].strip()

def get_key(text):
	key = re.findall('Key: ([A-Z|a-z]+)', text)
	return 'N/A' if key is None or len(key) == 0 else key[0]

def get_duration(text):
	duration = re.findall('Duration: ([0-9]+:[0:9]+)', text)
	return 'N/A' if duration is None or len(duration) == 0 else duration[0]

def extract_page_numbers(text):
	find_page_numbers = re.findall('\W+(Page\W+[0-9]+/[0-9]+)', text)
	for found_page_number in find_page_numbers:
		start_index = text.find(found_page_number)
		end_index = start_index + len(found_page_number)
		text = text[0:start_index] + text[end_index:] 
	return text

def replace_weird_chord_characters(text):
	return text.replace('Gc', 'G').replace('Cc', 'C')

def left_strip(body_list):
	index = 0
	while index < len(body_list):
		if ('[Verse' in body_list[index]):
			body_list[index] = body_list[index].lstrip()
		if ('[Chorus' in body_list[index]):
			body_list[index] = body_list[index].lstrip()
		if ('[Break' in body_list[index]):
			body_list[index] = body_list[index].lstrip()
		if ('[Outro' in body_list[index]):
			body_list[index] = body_list[index].lstrip()
		index += 1
	return body_list

def add_new_lines(body_list):
	index = 0
	while index < len(body_list) - 1:
		if ('[Verse' in body_list[index]):
			body_list.insert(index + 1, '')
			index += 2
		elif ('[Chorus' in body_list[index]):
			body_list.insert(index + 1, '')
			index += 2
		elif ('[Break' in body_list[index]):
			body_list.insert(index + 1, '')
			index += 2
		elif ('[Outro' in body_list[index]):
			body_list.insert(index + 1, '')
			index += 2
		else:
			index += 1
	index = 2
	while index < len(body_list):
		body_list.insert(index + 2, '')
		if ((index + 3 < len(body_list)) and '[Verse' not in body_list[index + 3] and '[Chorus' not in body_list[index + 3] and '[Outro' not in body_list[index + 3] and '[Break' not in body_list[index + 3]):
			index += 3
		elif((index + 3 < len(body_list)) and '[Break' in body_list[index + 3]):
			index += 5
			body_list.insert(index + 1, '')
			index += 4
		else:
			index += 5
	return body_list


def format_body_string(body_string):
	split_body_string = body_string.split('\n')[1:]
	count_white_space = len(split_body_string[0]) - len(split_body_string[0].lstrip())
	body_list = [ line[count_white_space:] for line in split_body_string if len(line) > count_white_space ]
	formatted_body_list = add_new_lines(left_strip(body_list))
	return '\n'.join(formatted_body_list)

def get_body(text):
	body = []
	if ('[Verse 1]' in text):
		find_verse1 = re.findall('(\W+\[Verse 1\])', text)[0]
		body = text.split(find_verse1)
		body_string = find_verse1 + '\n' + body[1]
		body_string = '\n'.join(body_string.split('\n')[1:])
	elif ('[Verse]' in text):
		find_verse = re.findall('(\W+\[Verse\])', text)[0]
		body = text.split(find_verse, 1)
		body_string = find_verse + '\n' + body[1]
	body_string = format_body_string(body_string)
	return body_string


def read_pdf_file(pdf_file):
	output_folder_name = pdf_file[0:pdf_file.find('.pdf')]
	output_directory = write_pdf_to_images(pdf_file, output_folder_name)
	output_files = [output_directory + '/' + file for file in os.listdir(output_directory)]
	text = ''
	for file in output_files:
		text += convert_image_to_text(file)
	shutil.rmtree(OUTPUT_DIR)
	return text

def pdf_title_to_text_title(pdf_file):
	text_file = pdf_file.replace('.pdf', '').replace('official', '').replace('chords', '').strip()
	return text_file.lower() + '.txt'

def write_to_text_file(pdf_file):
	text_file = pdf_title_to_text_title(pdf_file)
	text = read_pdf_file(pdf_file)
	text = extract_page_numbers(text)
	text = replace_weird_chord_characters(text)
	body = get_body(text)
	
	return body + '\n'


# pdf_file = sys.argv[1]
# write_to_text_file(pdf_file)
