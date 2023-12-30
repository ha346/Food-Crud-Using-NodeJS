var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
var fs = require('fs')
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage=new LocalStorage('./scratch')

router.get('/food', function (req, res, next) {
    try {
        var admin = JSON.parse(localStorage.getItem('ADMIN'))
        if (admin == null) {
            res.render('LoginPage',{message:''})

        }
    
        res.render('foodInterface', { status: null })
    }
    catch(e)
    {
        res.render('LoginPage',{message:''})
    }
})

router.get('/fetchfoodtype', function (req, res, next) {
    
    pool.query('select * from foodtype', function (error, result) {
        
        if (error) {
            res.status(500).json([])
        }
        else {
            res.status(200).json(result)
        }
    })

})


router.get('/fetchfood', function (req, res, next) {
    
        pool.query('select * from food where foodtypeid=?',[req.query.foodtypeid], function (error, result) {
            
            if (error)
            {
                res.status(500).json([])
            }
            else
            {

                res.status(200).json(result)
            }
        })
    
})

router.post('/insertrecord',upload.single('picture'), function (req, res, next) {
    
    console.log(req.body)
    pool.query('insert into fooddetails(foodtypeid,foodid,description,price,offerprice,type,status,picture) values(?,?,?,?,?,?,?,?)',[req.body.foodtypeid,req.body.foodid,req.body.description,req.body.price,req.body.offerprice,req.body.type,req.body.status,req.file.originalname], function (error, result) {
        
        if(error) 
        {
            console.log(error) 
            res.render('foodInterface',{status:0})  
        }
        else
        {
            console.log(result)
             res.render('foodInterface',{status:1})
        }

    })

})


router.get('/displayrecord', function (req, res, next) {
    try {

        var admin = JSON.parse(localStorage.getItem('ADMIN'))
        if (admin == null) {
            res.render('LoginPage', { message: '' })
        }
        
        pool.query('select FD.*,(select FT.foodtypename from foodtype FT where FT.foodtypeid=FD.foodtypeid) as foodtypename,(select F.foodname from food F where F.foodid=FD.foodid) as foodname from fooddetails FD', function (error, result) {
        
            if (error) {
                console.log(error)
                res.render('DisplayFood', { status: false, data: '' })
            }
            else {
                console.log(result)
                res.render('DisplayFood', { status: true, data: result })
            }

        })
    }
    catch(e)
    {
        res.render('LoginPage',{message:''})

    }
})


router.get("/displayrecordbyid", function (req, res, next) {
    
    pool.query('select FD.*,(select FT.foodtypename from foodtype FT where FT.foodtypeid=FD.foodtypeid) as foodtypename,(select F.foodname from food F where F.foodid=FD.foodid) as foodname from fooddetails FD where fooddetailid=?', [req.query.fid], function (error, result) {
        
        if (error)
        {
            res.render('DisplayRecordById',{status:false,data:[]})
        }

        else
        {
            res.render('DisplayRecordById', { status: true, data:result[0]})
        }
    })
})


router.post('/editdeleterecord', function (req, res, next) {
 
    if (req.body.action == 'Edit') {
        pool.query('update fooddetails set foodtypeid=?,foodid=?,description=?,price=?,offerprice=?,type=?,status=? where fooddetailid=?', [req.body.foodtypeid, req.body.foodid, req.body.description, req.body.price, req.body.offerprice, req.body.type, req.body.status, req.body.fooddetailid], function (error, result) {
        
            if (error) {
                res.redirect('/food/displayrecord')
            }
            else {
                res.redirect('/food/displayrecord')
            }
        
        })
    }

    else if (req.body.action == "Delete")
    {
        pool.query('delete from fooddetails where fooddetailid=?', [req.body.fooddetailid], function (error, result) {
        
            if (error) {
                res.redirect('/food/displayrecord')
            }
            else {
                res.redirect('/food/displayrecord')
            }
        
        })
    }
})


router.get('/displayfoodpicture', function (req, res, next) {
    
    res.render('DisplayPicture',{fid:req.query.fid,fname:req.query.fname,foodpicture:req.query.foodpicture})
})


router.post('/editpicture',upload.single('picture'), function (req, res, next) {
    console.log(req.body)
    pool.query('update fooddetails set picture=? where fooddetailid=?', [req.file.filename, req.body.fooddetailid], function (req, res, next) {
          
        if(error)
        {
            console.log(error)
            res.redirect('/food/displayrecord')
        }
        else
        {
            var filePath="E:/SappalSir's_Folder/Node Projects/foodProject/public/images/"+req.body.oldpicture
            fs.unlinkSync(filePath)
            console.log(result)
            res.redirect('/food/displayrecord') 
        }
    })
})


module.exports = router;