CREATE TABLE reviews
(
  id integer PRIMARY KEY,
  book_id VARCHAR(13) REFERENCES books (id),
  text text
)

CREATE TABLE books
(
  id VARCHAR(13) NOT NULL PRIMARY KEY,
  title character varying(100) NOT NULL,
  description text,
  rate integer NOT NULL,
  genre character varying(25)
)

INSERT INTO review (book_id, text) 
VALUES (
	2, 
	`Loved it! Great pacing and characters`
)

INSERT INTO review (book_id, text) 
VALUES (
	1, 
	`Beautifully written and full of emotion. The world-building feels real and alive — definitely a must-read.`
)

INSERT INTO review (book_id, text) 
VALUES (
  1, 
  `An enjoyable read with engaging characters and a fast-paced story. I couldn't put it down once I started!`
  )

INSERT INTO book (title, description, rate, isbn, genre) 
VALUES (
  '0060577363',
  'Flyte (Septimus Heap, Book 2)', 
  `It has been a year since Septimus Heap discovered his real family and true calling to be a wizard. As Apprentice to Extra Ordinary Wizard Marcia Overstrand, he is learning the fine arts of Conjurations, Charms, and other Magyk, while Jenna is adapting to life as the Princess and enjoying the freedom of the Castle.But there is something sinister at work. Marcia is constantly trailed by a menacing Darke Shadow, and Septimus\'s brother Simon seems bent on a revenge no one understands. Why is the Darke Magyk still lingering?Bringing fantasy to new heights, Angie Sage continues the journey of Septimus Heap with her trademark humor and all of the clever details readers have come to love.`,
  '4',
  'Fantasy'
)

INSERT INTO book (title, description, rate, isbn, genre) 
VALUES (
  '0060577320',
  'Magyk (Septimus Heap)', 
  `Septimus Heap, the seventh son of the seventh son, disappears the night he is born, pronounced dead by the midwife. That same night, the baby's father, Silas Heap, comes across an abandoned child in the snow -- a newborn girl with violet eyes. The Heaps take her into their home, name her Jenna, and raise her as their own. But who is this mysterious baby girl, and what really happened to their beloved son Septimus?`,
  '4',
  'Fantasy'
)

INSERT INTO book (title, description, rate, isbn, genre) 
VALUES (
  '006057738X',
  'Physik (Septimus Heap)', 
  `When Silas Heap unSeals a forgotten room in the Palace, he releases the ghost of a Queen who lived five hundred years earlier. Queen Etheldredda is as awful in death as she was in life, and she's still up to no good. Her diabolical plan to give herself everlasting life requires Jenna's compliance, Septimus's disappearance, and the talents of her son, Marcellus Pye, a famous Alchemist and Physician. And if Queen Etheldredda's plot involves Jenna and Septimus, then it will surely involve Nicko, Alther Mella, Marcia Overstrand, Beetle, Stanley, Sarah, Silas, Spit Fyre, Aunt Zelda, and all of the other wacky, wonderful characters that made Magyk and Flyte so memorable`,
  '3',
  'Fantasy'
)