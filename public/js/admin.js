$('#douban').blur(function() {
    var douban = $(this)
    var id = douban.val()

    if (id) {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function(data) {
          $('#inputTitle').val(data.title)
          $('#inputDoctor').val(data.directors[0].name)
          $('#inputCountry').val(data.countries)
          $('#inputPoster').val(data.images.large)
          $('#inputYear').val(data.year)
          $('#inputSummary').val(data.summary)
        }
      })
    }
  })