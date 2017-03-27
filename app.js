var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('underscore');
var mongoose = require('mongoose');
var Movie = require('./models/movie.js');
var Comment =require('./models/comment.js');
var port = process.env.PORT || 3000;
var app = express();


mongoose.connect('mongodb://localhost/imooc');
mongoose.connection.on('connected', function () {
  console.log('Connection success!');
});
//mongoose.Promise = global.Promise;
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(bodyParser.json());
app.locals.moment = require('moment');
app.listen(port, function () {
  console.log('server start on port:' + port);
});

//routes
//index
app.get('/', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }
    res.render('main', {
      title: '首页',
      movies: movies
    });
  });
});
//movie
app.get('/movie', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('movie', {
            title: '电影详情页',
            movies: movies
        });
    });
});


//top
app.get('/top', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('top', {
            title: 'TOP250',
            movies: movies
        });
    });
});
//detail
app.get('/movie/:id', function (req, res) {
  var id = req.params.id;
  Movie.findById(id, function (err, movie) {
    if (err) {
      console.log(err)
    }
    res.render('detail', {
      title: '详情页' + movie.title,
      movie: movie
    });
  });

});
//admin
app.get('/admin/movie', function (req, res) {
  res.render('admin', {
    title: '后台录入',
    movie: {
      title: '',
      doctor: '',
      country: '',
      language: '',
      summary: '',
      year: '',
      flash: '',
      poster: ''
    }
  });
});
app.get('/admin/update/:id', function (req, res) {
  var id = req.params.id;
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('admin', {
        title: '后台更新',
        movie: movie,
      });
    });
  }
});


app.post('/admin/movie/new', function (req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if (id !== 'undefined') {
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function (err, movie) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      language: movieObj.language,
      country: movieObj.country,
      year: movieObj.year,
      poster: movieObj.poster,
      flash: movieObj.flash,
      summary: movieObj.summary,

    })
    _movie.save(function (err, movie) {
      if (err) {
        console.log(err);
      }
      res.redirect('/movie/' + movie._id)
    })
  }
})

//list
app.get('/admin/list', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: '列表',
      movies: movies
    });
  })
});

//delete
app.delete('/admin/list', function (req, res) {
  var id = req.query.id;
  if (id) {
    Movie.remove({
      _id: id
    }, function (err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: 1
        })
      }
    })
  }
})




//admincomment
app.get('/admincomment/comment', function (req, res) {
    res.render('admincomment', {
        title: '撰写影评',
        comment: {
            title: '',
            commentname: '',
            mark: '',
            content: ''
        }
    });
});
app.get('/admincomment/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Comment.findById(id, function (err, comment) {
            res.render('admincomment', {
                title: '后台更新',
                comment: comment,
            });
        });
    }
});


app.post('/admincomment/comment/new', function (req, res) {
    var id = req.body.comment._id;
    var commentObj = req.body.comment;
    var _comment;
    if (id !== 'undefined') {
        Comment.findById(id, function (err, comment) {
            if (err) {
                console.log(err);
            }
            _comment = _.extend(comment, commentObj);
            _comment.save(function (err, comment) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/comment/' + comment._id)
            })
        })
    } else {
        _comment = new Comment({
            title: commentObj.title,
            commentname: commentObj.commentname,
            mark: commentObj.mark,
            content: commentObj.content,
        });
        _comment.save(function (err, comment) {
            if (err) {
                console.log(err);
            }
            res.redirect('/comment/' + comment._id)
        })
    }
});

//listcomment
app.get('/admincomment/listcomment', function (req, res) {
    Comment.fetch(function (err, comments) {
        if (err) {
            console.log(err);
        }
        res.render('listcomment', {
            title: '列表',
            comments: comments
        });
    })
});

//delete
app.delete('/admincomment/listcomment', function (req, res) {
    var id = req.query.id;
    if (id) {
        Comment.remove({
            _id: id
        }, function (err, comment) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    success: 1
                })
            }
        })
    }
});

//detailcomment
app.get('/comment/:id', function (req, res) {
    var id = req.params.id;
    Comment.findById(id, function (err, comment) {
        if (err) {
            console.log(err)
        }
        res.render('detailcomment', {
            title: '详情页' + comment.title,
            comment: comment
        });
    });
});