module.exports = function(RED) {
    "use strict"

	function GOcontrollWriteMemory(config) {
	   RED.nodes.createNode(this,config);

	const fs = require('fs');

	var node = this;
	const key 			= config.key;
	const inputType		= config.inputtype
	const decimal		= parseInt(config.decimal)

	var oldValue ={};
	
	
	/***************************************************************************************
	** \brief
	**
	**
	** \param
	** \param
	** \return
	**
	****************************************************************************************/
	node.on('input', function(msg) {
    
		/* First check if folder is present if not, create one*/
		if (!fs.existsSync('/usr/mem-sim')) {
		fs.mkdirSync('/usr/mem-sim');
		}
					
		/* If no key is given, the function listens to all keys and save them */ 
		if(key == "")
		{
			if(inputType === "payload")
			{
				node.warn("When the input is a payload, a key to store the value is manditory");
				return;
			}
			
			for(var prop in msg) {
				if (msg.hasOwnProperty(prop)) {
					
					if(msg[prop] != oldValue[prop])
					{
					oldValue[prop] = msg[prop];
					fs.writeFile('/usr/mem-sim/'+prop, String(msg[prop].toFixed(decimal)), (err) => {
						if (err) throw err;
						//console.log('The file has been saved!');
						});
					}
				}
			}
		}
		
		/* If key is provided, use the specific key to send data */
		else if(msg[key] != NaN && inputType === "object")
		{
			if(msg[key] != oldValue[key])
			{
				oldValue[key] = msg[key];
				fs.writeFile('/usr/mem-sim/'+key, String(msg[key].toFixed(decimal)), (err) => {
				if (err) throw err;
				//console.log('The file has been saved!');
				});
			}
		}
		else if (msg.payload != NaN)
		{
			if(msg.payload != oldValue[key])
			{
				oldValue[key] = msg.payload;
				fs.writeFile('/usr/mem-sim/'+key, String(msg.payload.toFixed(decimal)), (err) => {
				if (err) throw err;
				//console.log('The file has been saved!');
				});
			}
		}
			
    });
	
	/***************************************************************************************
	** \brief
	**
	**
	** \param
	** \param
	** \return
	**
	****************************************************************************************/
	node.on('close', function(done) {
	done();
	});
		
		
    }
	RED.nodes.registerType("Write-Memory",GOcontrollWriteMemory);
}
