import os
import logging
from logging import Formatter, FileHandler
from flask import Flask, request, jsonify, render_template
import string
from multiprocessing import Pool

from ocr import process_image

app = Flask(__name__)
_VERSION = 1  # API version


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/v{}/ocr'.format(_VERSION), methods=["POST"])
def ocr():
    try:
        urls = request.json['image_urls']
        output = [process_image(url) for url in urls]
        return jsonify({"output": output})
    except:
        return jsonify(
            {"error": "Did you mean to send: {'image_url': 'some_img_url'}"}
        )


@app.route('/v{}/ocr_kw'.format(_VERSION), methods=["POST"])
def ocr_kw():
    try:
        urls = request.json['image_urls']
        keywords = request.json['keywords']
        p = Pool()
        texts = p.map(process_image, urls)
        # texts = [process_image(url) for url in urls]
        texts = [''.join(filter(lambda c: c in string.printable, text)) for text in texts]
        contains = [any(kw in text for kw in keywords) for text in texts]
        contains_dict = dict(zip(texts, contains))
        return jsonify({"output": texts, "contains_kw": contains_dict})
    except Exception as e:
        return jsonify(
            {"error": str(e)}
        )


@app.errorhandler(500)
def internal_error(error):
    print str(error)  # ghetto logging


@app.errorhandler(404)
def not_found_error(error):
    print str(error)

if not app.debug:
    file_handler = FileHandler('error.log')
    file_handler.setFormatter(
        Formatter('%(asctime)s %(levelname)s: \
            %(message)s [in %(pathname)s:%(lineno)d]')
    )
    app.logger.setLevel(logging.INFO)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.info('errors')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
