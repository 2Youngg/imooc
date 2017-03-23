/**
 * Created by tuzhengyangd on 2017-03-23.
 */
$(function () {
    $.ajax({
        url: "https://api.douban.com/v2/movie/top250?count=50&start=0",
        type: 'GET',
        dataType: 'JSONP',  // 处理Ajax跨域问题
        success: function (data) {
            console.log(data);
            $.each(data.subjects,function (i,item) {
                var html='<div class="col-sm-4 col-md-2">';
                html += '<div class="thumbnail">';
                html += '<img src="'+item.images.large;
                html += '" alt="...">';
                html += '<div class="caption">';
                html += '<p>' + item.title + '</p>';
                html += '<p>评分：'+ item.rating.average + '</p>';
                html += '<p><a href="#" class="btn btn-primary" role="button">电影详情</a> </p>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                $('#movie').append(html);
            })
        }
    })
})