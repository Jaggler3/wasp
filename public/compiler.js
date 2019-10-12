var _artifacts = ["Hello World!"];

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

var Variable = function()
{
    this.value = undefined;
    this.ID = genID();
    this.isFunction = false;
};

function genID()
{
    var a = "0x", b = "ABCDEFHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz12345";
    for(var i = 0; i < 6; i++)
    {
        a += b.charAt(Math.floor(Math.random() * b.length));
    }
    return a;
}

function getLink()
{
	return document.location.origin + "/?" + inval.value + "&" + encodeURI(artl.value.split("\n").join(","));
}

var shlnk = ele("sharelink");
setInterval(function() {
	var res = getLink();
	shlnk.innerHTML = res;
	shlnk.setAttribute("href", res);
}, 750);

var artl, inval;
artl = ele("artifacts");
inval = ele("in");
if(document.location.toString().indexOf("?") != -1)
{
	var dls = document.location.toString();
	var ress = dls.substring(dls.indexOf("?") + 1);
	inval.value = decodeURI(ress).split("&")[0];
	artl.value = decodeURI(ress).split("&")[1].split(",").join("\n");
} else
{
	artl.value = _artifacts.join("\n");
}

inval.onkeypress = function(key)
{
    if(event.keyCode == 13) { b_ie(); }
};

function atf(char)
{
	inval.value += char;
	inval.focus();
}

function ic(str)
{
    inval.value = str;
    inval.setSelectionRange(inval.value.length, inval.value.length);
    inval.focus();
}

function ml()
{
	if(inval.selectionStart === 0) { return; }
	inval.setSelectionRange(inval.selectionStart - 1, inval.selectionStart - 1);
	inval.focus();
}

function mr()
{
	if(inval.selectionStart == inval.length - 1) { return; }
	inval.setSelectionRange(inval.selectionStart + 1, inval.selectionStart + 1);
	inval.focus();
}

function bs()
{
	var cp = inval.selectionStart;
	inval.value = inval.value.substring(0, cp - 1) + inval.value.substring(cp, inval.value.length);
	inval.setSelectionRange(cp, cp);
	inval.focus(); 
}

function i_cl()
{
	inval.value = "";
	inval.focus();
}

function b_cl()
{
    output = "";
}
function b_ie()
{
    _artifacts = artl.value.split("\n");
    for(var i = 0; i < _artifacts.length; i++)
    {
        if(!isNaN(_artifacts[i]))
        {
            _artifacts[i] = Number(_artifacts[i]);
        }
    }
    ie(inval.value.toString());
}

function ie(script, ed = {})
{
    if(ed.index === undefined)
    {
        //.cookie = "val=" + encodeURI(inval.value) + ";";
        //console.log(document.cookie);
    }
	var _vars = ed.vars || [];
	var INDEX = ed.index === undefined ? -1 : ed.index;
	var _rs = false; //right side
	var prnt = false; //print
	var op_a = false, op_m = false, op_d = false, op_t = false, op_b = false; //addition / minus / distance / multiply / break(divide) operations
	var idg = false; //id get
	var lov = false; //length operator value
	var coi = false; //close-out-if
	var hi = false, si = false, fi = false; //(have/start/false) if
	var fc = false; //function
	var nl = true; //new line
	var lc = false; //expecting loop condition
	var ld = "", lcd = ""; //loop (data/condition data
	var dt = false; //double times-symbols (meaning '')
	var lst = -1;	//last index
	var InterUtils = InterUtils || {
	    runLoop: function(condition) {
    	    var led = ie(ld, {vars: _vars, index: INDEX});
    	    while(led.vars[led.index].value != condition) { led = ie(ld, {vars: _vars, index: INDEX}); }
	    },
	    operation: function(right) {
	        if(prnt)
    		{
    			outstr(right, nl);
    			prnt = false;
    		} else if(InterUtils.ol(right)) {
    		} else if(si)
    		{
    		    si = false;
    		    if(op_d)
    		    {
                    op_d = false;
                    //console.log(_vars[INDEX].value - right);
                    coi = _vars[INDEX].value - right <= 0;
                    coi = fi ? !coi : coi;
    		    } else
    		    {
    		        coi = _vars[INDEX].value !== right;
    		        coi = fi ? !coi : coi;
    		    }
            } else if(lc)
    		{
    		    lc = false;
    		    runLoop(right);
    		} else //(we are setting a var) 
    		{
    			_vars[INDEX].value = right;
    		}
	    },
	    ol: function(right) {
    	    var tv = _vars[INDEX].value;
    	    if(typeof tv === "undefined") { _vars[INDEX].value = right; return true; }
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
    	    if(typeof _vars[INDEX].value == "number" && !dt) {
    	        _vars[INDEX].value += op_a ? right : (op_m ? -right : 0);
    	        _vars[INDEX].value *= op_t ? right : (op_b ? 1/right : 1);
    	    } else {
    	        _vars[INDEX].value = right > 0 ? _vars[INDEX].value.toString().repeat(op_t ? right : 1) : "";
				dt = false;
    	    }
    	    if(edc !== 0)
    	    {
    	        _vars[INDEX].value = Number(_vars[INDEX].value.toFixed(edc).toString());
    	    }
    	    var tmp = op_a || op_m || op_t || op_b; op_a = op_m = op_t = op_b = false;
    		return tmp;
	    }
	};
	
	var s = script.toString().split("");
	for(var i = 0; i < s.length; i++)
	{	
		var c = s[i];
		                                                    //1  2     3     4     5     6     7     8    9    10  11  12  13  14  15
		//console.log(i + "|" + c + "|\t{" + INDEX  + "}[" + [_rs, prnt, op_a, op_m, op_d, op_t, op_b, idg, coi, hi, si, fi, fc, nl, lc].map(Number).join(" ") + "]");
		if(coi && c !== "#") { continue; }
		if(c === "?") { INDEX = 0; continue; };
		if(c === "/" && s[i + 1] === '/') //exit, also provides comments to end of input
		{
		    return;
		} else if(c === "/") //restart function/program
		{
		    ie(script, {vars: _vars, index: INDEX});
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
				_vars.push(nv);
				_rs = true;
				INDEX = _vars.length - 1;
				i++;
			} else if(s[i + 1] === "<") //delete current variable
			{
			    _vars.splice(INDEX, 1);
			    INDEX += (INDEX == 0 ? 0 : -1);
				i++;
			}
		} else if(c ==="@") //accessing globals
		{
			var id = script.substring(++i, script.indexOf("|", i));
		    i += id.length;
			InterUtils.operation(lov ? (_globals[Number(id)] + "").length : _globals[Number(id)]);
			_rs = false;
			lov = idg = false;
		} else if(c === "_") //accessing an artifact
		{
			var id = script.substring(++i, script.indexOf("|", i));
		    i += id.length;
			InterUtils.operation(lov ? (_artifacts[Number(id)] + "").length : _artifacts[Number(id)]);
			_rs = false;
			lov = idg = false;
		} else if(c === "$") //accessing the current variable
		{
		    if(fc)
		    {
		        fc = false;
		        var pi = INDEX;
		        ie(_vars[INDEX].value, {vars: _vars, index: INDEX});
		        INDEX = pi; 
		    } else if(_rs)
		    {
		        InterUtils.operation(idg ? _vars[INDEX].ID : (lov ? (_vars[INDEX].value + "").length : _vars[INDEX].value));
		        lov = idg = false;
		    } else
		    {
		        if(idg)
    		    {
    		        InterUtils.operation(_vars[INDEX].ID);
    		        idg = false;
    		    } else if(lov)
    		    {
    		        InterUtils.operation((_vars[INDEX].value + "").length);
    		        lov = false;
    		    } else
    		    {
    		        _rs = true;
    		    }
		    }
		} else if(c === "+") //increment
		{
		    _rs = op_a = s[i + 1] === "+";
		    i += op_a ? 1 : 0;
		    if(typeof _vars[INDEX].value == "number") { _vars[INDEX].value += !op_a ? 1 : 0; }
		} else if(c === "-") //decrement
		{
		    _rs = op_m = s[i + 1] === "-";
		    i += op_m ? 1 : 0;
		    if(typeof _vars[INDEX].value == "number") { _vars[INDEX].value -= !op_m ? 1 : 0; }
		} else if(c === "'") //times
		{
			dt = op_t;
		    _rs = op_t = true;
		    //if(typeof _vars[INDEX].value == "number") { _vars[INDEX].value *= !op_t ? 1 : 0; }
		} else if(c === "\"") //break (divide)
		{
		    _rs = op_b = true;
		    //if(typeof _vars[INDEX].value == "number") { _vars[INDEX].value /= !op_b ? 1 : 0; }
		} else if(c === "~") //distance
		{
		    _rs = op_d = true
		} else if(c === "!") //print out
		{
		    _rs = true;
			prnt = true;
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
				        ie(_vars[INDEX + amt].value, {vars: _vars, index: INDEX});
				    } else if(lc)
				    {
        			    InterUtils.runLoop(_vars[INDEX + amt].value);
				        INDEX += amt;
                    } else if(op_d && !si)
                    {
                        _vars[INDEX].value -= _vars[INDEX + amt].value;
                        _rs = op_d = false;
                    } else if((op_d || op_t || op_m || op_a || op_b))
                    {
                        //console.log(INDEX + amt)
						if(lov)
						{
							console.log(INDEX, amt);
						}
                        InterUtils.operation(idg ? _vars[INDEX + amt].ID : (lov ? (_vars[INDEX + amt].value + "").length : _vars[INDEX + amt].value));
                    } else
				    {
				        INDEX += amt;
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
			_vars[INDEX].value = func;
			_vars[INDEX].isFunction = true;
			_rs = false;
		} else if(c === "*") { fc = true;
		} else if(c === "&")
		{
			console.log(_vars.length);
		}
	}
	
	return {vars: _vars, index: INDEX};
}

var output = "";
window.setInterval(function(){ ele("out").innerHTML = output; }, 50);
function ele(id) { return document.getElementById(id); };
function outstr (str, nl = true) { output += str + "<br/>".repeat(Number(nl)); }