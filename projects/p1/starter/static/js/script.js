window.parseISOString = function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
};

function deleteVenue(venueId) {
  fetch('/venues/' + venueId, {
    method: 'DELETE'
  }).then(response => response.json())
    .then(jsonResponse => {
      if(jsonResponse['success'])
        alert('Error!')
      else
      location.replace("/")
    })
    .catch(function() {
      alert('Error!')
    })
};

function deleteVenue_refresh(venueId) {
  fetch('/venues/' + venueId, {
    method: 'DELETE'
  }).then(response => response.json())
    .then(jsonResponse => {
      if(jsonResponse['success'])
        alert('Error!')
      else
      location.reload()
    })
    .catch(function() {
      alert('Error!')
    })
};

function editVenue(venueId) {
  location.replace('/venues/' + venueId + '/edit')
};

function editArtist(artistId) {
  location.replace('/artists/' + artistId + '/edit')
};

function seekingTalentDescriptionVisibility(){
  var checked = document.getElementById('seeking_talent').checked
  if (checked){
    document.getElementById('seeking_description').disabled = false
  } else {
    document.getElementById('seeking_description').value = ""
    document.getElementById('seeking_description').disabled = true
  }
};

function seekingVenueDescriptionVisibility(){
  var checked = document.getElementById('seeking_venue').checked
  if (checked){
    document.getElementById('seeking_description').disabled = false
  } else {
    document.getElementById('seeking_description').value = ""
    document.getElementById('seeking_description').disabled = true
  }
};