import docx

doc = docx.Document(r"D:\Downloads\Memoire_TrustDesk_FINAL.docx")
for i, p in enumerate(doc.paragraphs):
    print(f"Para {i} [Style: {p.style.name}]: {p.text}")
