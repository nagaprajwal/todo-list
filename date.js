///this functionality is to export the getdate module to the app.js 
module.exports.getdate=getdate;
module.exports.getday=getday;

function getdate(){
    var today=new Date();

    var option={
     weekday: "long",
     day: "numeric",
     month: "long"
    };
    
    return   today.toLocaleDateString("en-US",option);

    
}

//exporting another module in the same module name 
function getday(){
    var today=new Date();

    var option={
     weekday: "long",
  
    };
    
    return today.toLocaleDateString("en-US",option);

   
}
