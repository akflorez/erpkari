import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text(docx_path):
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            xml_content = zip_ref.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = tree.findall('.//w:t', namespace)
            text = '\n'.join([p.text for p in paragraphs if p.text])
            return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <path_to_docx>")
        sys.exit(1)
    
    content = extract_text(sys.argv[1])
    with open('instructivo_texto.txt', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Extraction complete. saved to instructivo_texto.txt")
