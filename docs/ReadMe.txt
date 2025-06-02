
Installation // Preparing the data
----------------------------------

in the folder :  factory/server/data there are json files containing the database collections' info :
 - departments.json
 - employees.json

 Run the following commands from the data folder:
      ** To install the mongoimport utility , use the following link : https://chatgpt.com/share/683db915-b504-8006-afd3-7687b5b60fe1 
 1) mongoimport --uri="mongodb://localhost:27017/factoryDB" --collection=departments --file=departments.json --jsonArray
 2) mongoimport --uri="mongodb://localhost:27017/factoryDB" --collection=employees --file=employees.json --jsonArray

 3)
    3.1)  In factory/server/data , you have a script named : updateManagers.js , open it and copy the script 
    3.2)  From studio 3t , right click : factoryDB and select : open intellishell 
    3.3)  Paste the code coppied at the previous 3.1 phase into the new intellishell tab 
    3.4)  Press the left most run button from the tool bar ( Run entire script) 
     
     You should get output similar to :

      Assigned Fiona Davis as manager of Finance
      Assigned Eli Brown as manager of HR
      Assigned Uma Bennett as manager of Customer Support
      Assigned Steve Carter as manager of Marketing
      Assigned Kyle Anderson as manager of Development

4) For verification you can :
     - Make sure departments collection exit, and managerId field is not null 
     - Make sure  employees collection exist , and there are 5 employees for each department 