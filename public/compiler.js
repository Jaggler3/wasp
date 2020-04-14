// Wasp language implemetation

// Default artifacts
var _artifacts = [
	"Hello World!"
];

// Global variable list
var _globals = [
	true,
	false,
	0,
	1,
	10,
	" ",
	"\n",
	",",
	-1,
	10,
	2
];

// Console stream after a script is executed
var output = "";

var shareLink = ele("sharelink");
var artifactField = ele("artifacts"), codeField = ele("in");

// Initialize a Variable object with a random ID
function Variable()
{
    this.value = undefined;
    this.ID = genID();
    this.isFunction = false;
};

// interval to update the share link
setInterval(function() {
	shareLink.setAttribute("href", (shareLink.innerHTML = getLink()));
}, 750);

// parse url for artifacts and code
if(document.location.toString().indexOf("?") != -1)
{
	var dls = document.location.toString();
	var ress = dls.substring(dls.indexOf("?") + 1);
	codeField.value = decodeURI(ress).split("&")[0];
	artifactField.value = decodeURI(ress).split("&")[1].split(",").join("\n");
} else
{
	artifactField.value = _artifacts.join("\n");
}

// Generate a variable ID
function genID()
{
    let id = "0x", range = "ABCDEFHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz12345";
    for(let i = 0; i < 6; i++)
    {
        id += range.charAt(Math.floor(Math.random() * range.length));
    }
    return id;
}

// Creates a link to the current set of artifacts and code for others to see
function getLink()
{
	return document.location.origin + "/?" + codeField.value + "&" + encodeURI(artifactField.value.split("\n").join(","));
}

// check for Enter key press to execute code
codeField.onkeypress = function(key)
{
    if(event.keyCode == 13) { b_ie(); }
};

// Add char to input code
function insertInput(char)
{
	codeField.value += char;
	codeField.focus();
}

// Move the input code cursor left
function cursorLeft()
{
	if(codeField.selectionStart === 0) { return; }
	codeField.setSelectionRange(codeField.selectionStart - 1, codeField.selectionStart - 1);
	codeField.focus();
}

// Move the input code cursor right
function cursorRight()
{
	if(codeField.selectionStart == codeField.length - 1) { return; }
	codeField.setSelectionRange(codeField.selectionStart + 1, codeField.selectionStart + 1);
	codeField.focus();
}

// Delete a char from the input code at the cursor
function backspace()
{
	var cp = codeField.selectionStart;
	codeField.value = codeField.value.substring(0, cp - 1) + codeField.value.substring(cp, codeField.value.length);
	codeField.setSelectionRange(cp, cp);
	codeField.focus();
}

// Clear all code from the input
function inputClear()
{
	codeField.value = "";
	codeField.focus();
}

// Clear all logs of executed code
function outputClear()
{
    output = "";
}

// Parse artifacts and execut input code
function callExecute()
{
    _artifacts = artifactField.value.split("\n");
    for(let i = 0; i < _artifacts.length; i++)
    {
        if(!isNaN(_artifacts[i]))
        {
            _artifacts[i] = Number(_artifacts[i]);
        }
	}
    execute(codeField.value);
}

// Execute Wasp code!
function execute(script, context = {})
{
	let vars = context.vars || [];
	let index = context.index === undefined ? -1 : context.index;
	let isRightSide = false; //right side
	let log = false; //print
	let op_a = false, op_m = false, op_d = false, op_t = false, op_b = false; //addition / minus / distance / multiply / break(divide) operations
	let idg = false; //id get
	let lov = false; //length operator value
	let coi = false; //close-out-if
	let hi = false, si = false, fi = false; //(have/start/false) if
	let fc = false; //function
	let nl = true; //new line
	let lc = false; //expecting loop condition
	let ld = "", lcd = ""; //loop (data/condition data
	let dt = false; //double times-symbols (meaning '')
	let lst = -1;	//last index
	var InterpreterUtils = InterpreterUtils || {
	    runLoop: function(condition) {
    	    let lastContext = execute(ld, {vars: vars, index: index});
			while(lastContext.vars[lastContext.index].value != condition)
			{
				execute(ld, {vars: vars, index: index});
			}
	    },
	    operation: function(right) {
	        if(log)
    		{
    			outstr(right, nl);
    			log = false;
    		} else if(InterpreterUtils.ol(right)) {
    		} else if(si)
    		{
    		    si = false;
    		    if(op_d)
    		    {
                    op_d = false;
                    //console.log(vars[index].value - right);
                    coi = vars[index].value - right <= 0;
                    coi = fi ? !coi : coi;
    		    } else
    		    {
    		        coi = vars[index].value !== right;
    		        coi = fi ? !coi : coi;
    		    }
            } else if(lc)
    		{
    		    lc = false;
    		    runLoop(right);
    		} else //(we are setting a var)
    		{
    			vars[index].value = right;
    		}
	    },
	    ol: function(right) {
    	    var tv = vars[index].value;
    	    if(typeof tv === "undefined") { vars[index].value = right; return true; }
    	    var edc = 0;
    	    if(op_t)
    	    {
    	        if((edc += tv.toString().indexOf(".")) === -1)
    	        {
    	            edc = 0;
    	        }
    	        if((edc += right.toString().indexOf(".")) === -1)
    	        {
    	            edc = 0;
    	        }
    	    } else if(op_b)
    	    {
    	        if((edc += tv.toString().indexOf(".")) === -1)
    	        {
    	            edc = 0;
    	        }
    	        if((edc += (1/right).toString().indexOf(".")) === -1)
    	        {
    	            edc = 0;
    	        }
    	    }
    	    if(typeof vars[index].value == "number" && !dt) {
    	        vars[index].value += op_a ? right : (op_m ? -right : 0);
    	        vars[index].value *= op_t ? right : (op_b ? 1/right : 1);
    	    } else {
    	        vars[index].value = right > 0 ? vars[index].value.toString().repeat(op_t ? right : 1) : "";
				dt = false;
    	    }
    	    if(edc !== 0)
    	    {
    	        vars[index].value = Number(vars[index].value.toFixed(edc).toString());
    	    }
    	    var tmp = op_a || op_m || op_t || op_b; op_a = op_m = op_t = op_b = false;
    		return tmp;
	    }
	};

	let s = script.toString().split("");
	for(let i = 0; i < s.length; i++)
	{
		let c = s[i];
		                                                    //1  2     3     4     5     6     7     8    9    10  11  12  13  14  15
		//console.log(i + "|" + c + "|\t{" + index  + "}[" + [isRightSide, log, op_a, op_m, op_d, op_t, op_b, idg, coi, hi, si, fi, fc, nl, lc].map(Number).join(" ") + "]");
		if(coi && c !== "#") { continue; }
		if(c === "?") { index = 0; continue; };
		if(c === "/" && s[i + 1] === '/') //exit, also provides comments to end of input
		{
		    return;
		} else if(c === "/") //restart function/program
		{
		    execute(script, {vars: vars, index: index});
		} else if(c === "^") //loop
		{
		    ld = script.substring(++i, script.indexOf("|", i));
		    i += ld.length;
		    lc = true;
		} else if(c === "#")
		{
            coi = hi ? false : coi;
            if(!hi)
		    {
		        if(s[i + 1] == "#") //not
		        {
		            fi = true;
		            i++;
		        }
		        si = true;
		        hi = true;
		    } else
		    {
		        hi = false;
		    }
		} else if(c === ";")
		{
			if(s[i + 1] === ">") //create new variable
			{
			    var nv = new Variable();
				vars.push(nv);
				isRightSide = true;
				index = vars.length - 1;
				i++;
			} else if(s[i + 1] === "<") //delete current variable
			{
			    vars.splice(index, 1);
			    index += (index == 0 ? 0 : -1);
				i++;
			}
		} else if(c ==="@") //accessing globals
		{
			var id = script.substring(++i, script.indexOf("|", i));
		    i += id.length;
			InterpreterUtils.operation(lov ? (_globals[Number(id)] + "").length : _globals[Number(id)]);
			isRightSide = false;
			lov = idg = false;
		} else if(c === "_") //accessing an artifact
		{
			var id = script.substring(++i, script.indexOf("|", i));
		    i += id.length;
			InterpreterUtils.operation(lov ? (_artifacts[Number(id)] + "").length : _artifacts[Number(id)]);
			isRightSide = false;
			lov = idg = false;
		} else if(c === "$") //accessing the current variable
		{
		    if(fc)
		    {
		        fc = false;
		        var pi = index;
		        execute(vars[index].value, {vars: vars, index: index});
		        index = pi;
		    } else if(isRightSide)
		    {
		        InterpreterUtils.operation(idg ? vars[index].ID : (lov ? (vars[index].value + "").length : vars[index].value));
		        lov = idg = false;
		    } else
		    {
		        if(idg)
    		    {
    		        InterpreterUtils.operation(vars[index].ID);
    		        idg = false;
    		    } else if(lov)
    		    {
    		        InterpreterUtils.operation((vars[index].value + "").length);
    		        lov = false;
    		    } else
    		    {
    		        isRightSide = true;
    		    }
		    }
		} else if(c === "+") //increment
		{
		    isRightSide = op_a = s[i + 1] === "+";
		    i += op_a ? 1 : 0;
		    if(typeof vars[index].value == "number") { vars[index].value += !op_a ? 1 : 0; }
		} else if(c === "-") //decrement
		{
		    isRightSide = op_m = s[i + 1] === "-";
		    i += op_m ? 1 : 0;
		    if(typeof vars[index].value == "number") { vars[index].value -= !op_m ? 1 : 0; }
		} else if(c === "'") //times
		{
			dt = op_t;
		    isRightSide = op_t = true;
		    //if(typeof vars[index].value == "number") { vars[index].value *= !op_t ? 1 : 0; }
		} else if(c === "\"") //break (divide)
		{
		    isRightSide = op_b = true;
		    //if(typeof vars[index].value == "number") { vars[index].value /= !op_b ? 1 : 0; }
		} else if(c === "~") //distance
		{
		    isRightSide = op_d = true
		} else if(c === "!") //print out
		{
		    isRightSide = true;
			log = true;
			nl = s[i + 1] !== "!";
			i += nl ? 0 : 1;
		} else if(c === "[")
		{
			var amt = 0;
			while(i <= s.length)
			{
				i++;
				if(s[i] != "]")
				{
					amt += s[i] === ">" ? 1 : -1;
				} else
				{
				    if(fc)
				    {
				        execute(vars[index + amt].value, {vars: vars, index: index});
				    } else if(lc)
				    {
        			    InterpreterUtils.runLoop(vars[index + amt].value);
				        index += amt;
                    } else if(op_d && !si)
                    {
                        vars[index].value -= vars[index + amt].value;
                        isRightSide = op_d = false;
                    } else if((op_d || op_t || op_m || op_a || op_b))
                    {
                        //console.log(index + amt)
						if(lov)
						{
							console.log(index, amt);
						}
                        InterpreterUtils.operation(idg ? vars[index + amt].ID : (lov ? (vars[index + amt].value + "").length : vars[index + amt].value));
                    } else
				    {
				        index += amt;
				    }
					fc = lc = false;
					break;
				}
			}
		} else if(c === "%")
		{
		    idg = true;
		} else if(c === "=")
		{
		    lov = true;
		} else if(c === "(") // start of a function
		{
			var func = script.substring(++i, script.indexOf(")", i));
		    i += func.length;
			vars[index].value = func;
			vars[index].isFunction = true;
			isRightSide = false;
		} else if(c === "*") { fc = true;
		} else if(c === "&")
		{
			console.log(vars.length);
		}
	}

	return {vars: vars, index: index};
}

window.setInterval(function(){ ele("out").innerHTML = output; }, 50);
function ele(id) { return document.getElementById(id); };
function outstr (str, nl = true) { output += str + "<br/>".repeat(Number(nl)); }
