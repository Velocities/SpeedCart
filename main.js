let elSrchResults = document.getElementById( "srchResults" );
let elSrchSubmit = document.getElementById( "srchSubmit" );
let elSrchValue = document.getElementById( "srchValue" );

function localServerQry( sendMethod, url, cbFunc ) {
    var xhttp = new XMLHttpRequest();
    
    // This might need to change to use onreadystatechange
    // for better error handling
    xhttp.onreadystatechange = function () {
        if ( xhttp.readyState === XMLHttpRequest.DONE ) {
            if ( xhttp.status === 200 ) {
                cbFunc( xhttp );
            } else {
                // Handle errors here
            }
        }
    };

    // Not sure if we want this async flag set as true,
    // but we'll give it a try and see how it works
    xhttp.open( sendMethod, url, true );
    xhttp.send();
}

function clearTblBodies( tblName ) {
    let elTbl = document.getElementById( tblName );
    for ( tbodyIdx = 0; tbodyIdx < elTbl.tBodies.length; tbodyIdx++ ) {
        elTbl.tBodies[tbodyIdx].innerHTML = "";
    }
}

function cbSrchSubmit( xhttp ) {
    var rspVal = xhttp.responseText;
    // This should be a 2D array containing the response values
    //var tblValues = JSON.parse( rspVal );
    var tblValues = JSON.parse( rspVal );

    var tblBody = elSrchResults.tBodies[0];
    clearTblBodies( "srchResults" );
    // Display the response on the page for the user
    for ( let rowIdx = 0; rowIdx < tblValues.length; rowIdx++ ) {
        let newRow = tblBody.insertRow();
        let cell1 = newRow.insertCell(); // #
        let cell2 = newRow.insertCell(); // Movie Name
        let cell3 = newRow.insertCell(); // Year of Release
        cell1.textContent = rowIdx + 1;
        cell2.textContent = tblValues[ rowIdx ][ 0 ];
        cell3.textContent = tblValues[ rowIdx ][ 1 ];
    }
}

function prepTblSrch( srchValue ) {
    var qry = "/src/tbl_qry.php?srchValue=" + srchValue;

    localServerQry( "GET", qry, cbSrchSubmit);
}

elSrchSubmit.onclick = function ( event ) {
    // Prevent the page from reloading
    event.preventDefault();

    // Grab the value entered in the search field by the user
    let srchValue = elSrchValue.value;
    prepTblSrch( srchValue );
}
