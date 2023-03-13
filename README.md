I want to make a dictionary application using the following API:	
External API: https://dictionaryapi.dev/

So depending on the word that the client searches, the definition of the word will be displayed, just like other interesting information such as synonyms or how to use the word in a sentence etc.

There will also be some features added where the client (after logging in) can see their favourite words, or previous searches etc. This will be stored in a database, for which I will be using mongodb.


#Crud:
As for create, It would be adding a previous search entry or favourite word.
For read it would be to retrieve a previously searched word and its information.
For update it would be for example that a user is able to add extra information about a word (after having added it as favourite), such as ticking of a box that states the user understands the definition.
As for delete it would be as simple as deleting a word from your favourite words list.