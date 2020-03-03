module.exports = function(RED) {
    "use strict"

	function GOcontrollReadMemory(config) {
	   RED.nodes.createNode(this,config);

		var fs 		= require('fs');

		var node 		= this;

		var key 		= config.key;
		const interval 	= parseInt(config.interval,10);
		
		var intervalGetData;
		var msgOut = {};

		intervalGetData = setInterval(ReadMemory_GetData,interval);

		/***************************************************************************************
		** \brief	Function that received data from the pipe (stream call back)
		**
		**
		** \param
		** \param
		** \return
		**
		****************************************************************************************/
		function ReadMemory_GetData(){
	
			/* Check if there are multiple keys used in the block */
			var splittedKeys = key.split(',');
					
			if(splittedKeys.length > 1)
			{
				for(let k = 0; k < splittedKeys.length; k ++)
				{
			

				var fileContents;
				try {
				fileContents = fs.readFileSync('/usr/mem-sim/'+String(splittedKeys[k]));
				} catch (err) {
				node.warn("Error during key search");	
				  // Here you get the error when the file was not found,
				  // but you also get any other error
				}
								
				msgOut[String(splittedKeys[k])] =  parseInt(fileContents);
				}
				
				node.send(msgOut);
				return;
			}
	
	
			fs.readFile('/usr/mem-sim/'+key, (err, data) => {
			
			if(data != NaN)
			{
			msgOut[key]= parseInt(data);
			node.send(msgOut);
			}
			
			if (err)
			{
			node.warn("Problem reading from memory key: "+key);
			clearInterval(intervalGetData);
			return;
			}
			
			});
		}


		/***************************************************************************************
		** \brief	Function that received data from the pipe (stream call back)
		**
		**
		** \param
		** \param
		** \return
		**
		****************************************************************************************/	
		node.on('input', function(msg) {

		});
			
			
		/***************************************************************************************
		** \brief	Function that received data from the pipe (stream call back)
		**
		**
		** \param
		** \param
		** \return
		**
		****************************************************************************************/
		node.on('close', function(done) {
		clearInterval(intervalGetData)
		done();
		});
    }
	RED.nodes.registerType("Read-Memory",GOcontrollReadMemory);
}