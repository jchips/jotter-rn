const demoNote = `# How to use Jotter
Hello! Jotter uses Markdown to create notes with text formatting.

> **Use this demo note to learn how to format text in Jotter**.

**Feel free to delete this note** once you no longer need it.

Bookmarking [this Markdown guide](https://www.markdownguide.org/basic-syntax/) might also help if you are new to Markdown.

Thank you for using Jotter.

---

### For mobile users:
**Double tap** anywhere on the screen to make the edit button appear and press it to view how Markdown text formatting works.

In the editor, you will see a **preview** of the rendered note with Markdown on the ***top half*** of the screen and the **text editor** where the typing/formatting happens on the ***bottom half***. **Double tap (again)** on the text editor half to start typing.

**You must press the save button in the editor *(bottom right corner)* to save any new text that you add to your notes**. Otherwise, your changes will not be saved and you will lose them upon exiting the note. If you prefer to not have the rendered text preview shown while you're editing the note, press the 'hide preview' button *(bottom left)* to toggle it on or off.

*Additional note: Use your mobile device's built-in back button/gesture to navigate through your created folders on the dashboard.*

### For web users:
**Double click** on a note or folder to open it from the dashboard. Once the note is opened, the edit button should be on the **bottom right** of the screen. Press the edit button to enter the text editor and view how Markdown text formatting works.

In the editor, you will see a **preview** of the rendered note with Markdown on the ***right half*** of the screen and the **text editor** where the typing/formatting happens on the ***left half***.

**You must press the save button in the editor *(bottom right corner or ctrl/cmd-s key command)* to save any new text that you add to your notes**. Otherwise, your changes will not be saved and you will lose them upon exiting the note.

*Additional note: If you ever save your note but your changes are not showing when you exit the editor then **refresh** the browser page *(ctrl/cmd-r key command)* and your changes should appear. This a known bug that is working to be fixed.*

Web link: [https://jotter.jrotech.com](https://jotter.jrotech.com)

---
# Markdown Example:


# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

---

This is **bold** text
This is *italic* text
This is ~~strikethrough~~ text

Underscores also work for __bold__ text or _italic text_

> This is a block quote

Bullet list

- bullet point 1
- bullet point 2
- bullet point 3

Numbered list

1. numbered item
2. numbered item
3. numbered item

This is \`inline code\`
\`\`\`
  codeBlock = true;
  \`\`\`

checkboxes

- [ ] unchecked box
- [x] checked box

[Link](https://www.google.com)

---
### Table
|column 1|column 2|column 3|
|-|-|-|
|item 1|item 2|item 3|
|item 4|item 5|item 6|

####  Table with aligned columns
|center|left|right|
|:-:|:-|-:|
|item 1|item 2|item 3|
|item 4|item 5|item 6|

---

### Images

![Jotter logo circle](https://iili.io/f1FRUt2.png)
![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://iili.io/f1FRSwl.png "Jotter logo squircle"

---
(c) (C) (r) (R) (tm) (TM) (p) (P) +-
  `;

export default demoNote;