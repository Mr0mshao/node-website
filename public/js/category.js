$(function(){
	$('.del').click(function(e){
		var target = $(e.target);
		var _id = target.data('id');
		var tr = $('.item-id-'+ _id);
		$.ajax({
			type : 'delete',
			url : '/admin/category/list?id=' +_id,
		}).done(function(results){

			if( results.success === 1){ 
				if( tr.length>0 ){
					tr.remove()
				}
			}
		})


	});
});
