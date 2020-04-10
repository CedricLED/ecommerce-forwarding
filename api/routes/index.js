const Joi = require('@hapi/joi');
const Order = require('../models').Order;
const Customer = require('../models').Customer;
const Package = require('../models').Package;
const IDCard = require('../models').IDCard;
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('home', {
      layout: false,
    });
  });
  app.get('/dashboard', checkAuth, (req, res) => {
    res.render('dashboard', {
      user: req.user,
    });
  });
  app.get('/customers', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      Customer.findAll().then((customers) => {
        res.render('customers', {
          user: req.user,
          customers: customers,
        });
      }).catch((err) => {
        console.log(err);
      });
    } else {
      res.send(404);
    }
  });
  app.post('/customers/ban', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      Customer.findOne({
        where: {
          id: req.body.id,
        },
      }).then((user) => {
        if (user.banned) {
          user.update({
            banned: false,
          }).then(() => {
            res.redirect('/customers');
          });
        } else {
          user.update({
            banned: true,
          }).then(() => {
            res.redirect('/customers');
          });
        }
      }).catch((err) => {
        console.log(err);
        res.redirect('/customers');
      });
    } else {
      res.send(404);
    }
  });
  app.post('/customers/delete', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      Customer.destroy({
        where: {
          id: req.body.id,
        },
      }).then(() => {
        res.redirect('/customers');
      }).catch((err) => {
        console.log(err);
        res.redirect('/customers');
      });
    } else {
      res.send(404);
    }
  });
  app.get('/ids', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      IDCard.findAll().then((photoIDs) => {
        res.render('ids', {
          user: req.user,
          photoIDs: photoIDs,
        });
      }).catch((err) => {
        console.log(err);
      });
    } else {
      res.send(404);
    }
  });
  app.get('/ids/view/:photoID', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      IDCard.findOne({
        where: {
          id: req.params.photoID,
        },
      }).then((photoID) => {
        photoID.getCustomer().then((customer) => {
          res.render('viewIDCard', {
            user: req.user,
            photoID: photoID,
            customer: customer,
          });
        });
      }).catch((err) => {
        console.log(err);
        res.send(404);
      });
    } else {
      res.send(404);
    }
  });
  app.get('/ids/new', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      Customer.findAll().then((customers) => {
        res.render('newIDCard', {
          customers: customers,
        });
      }).catch((err) => {
        console.log(err);
      });
    } else {
      res.send(404);
    }
  });
  app.post('/ids/new', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      IDCard.create({
        customerId: req.body.customerId,
        idName: req.body.idName,
        idNumber: req.body.idNumber,
        idFront: req.body.idFront,
        idRear: req.body.idRear,
      }).then(() => {
        res.redirect('/ids');
      }).catch((err) => {
        console.log(err);
      });
    } else {
      res.send(404);
    }
  });
  app.post('/ids/edit', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      IDCard.findOne({
        where: {
          id: req.body.id,
        },
      }).then((photoID) => {
        photoID.update({
          idName: req.body.idName,
          idNumber: req.body.idNumber,
          idFront: req.body.idFront,
          idRear: req.body.idRear,
        }).then((photoID) => {
          res.redirect('back');
        });
      }).catch((err) => {
        console.log(err);
        res.send(404);
      });
    } else {
      res.send(404);
    }
  });
  app.post('/ids/delete', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      IDCard.destroy({
        where: {
          id: req.body.id,
        },
      }).then(() => {
        res.redirect('/ids');
      }).catch((err) => {
        console.log(err);
        res.redirect('/ids');
      });
    } else {
      res.send(404);
    }
  });
  app.get('/orders', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      Order.findAll().then((orders) => {
        res.render('orders', {
          user: req.user,
          orders: orders,
        });
      }).catch((err) => {
        console.log(err);
      });
    } else {
      Order.findAll({
        where: {
          customerId: req.user.id,
        },
      }).then((orders) => {
        res.render('orders', {
          user: req.user,
          orders: orders,
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  });
  app.get('/orders/new', checkAuth, (req, res) => {
    req.user.getIDCards().then((photoIDs) => {
      res.render('newOrder', {
        user: req.user,
        photoIDs: photoIDs,
      });
    });
  });
  app.post('/orders/new', checkAuth, (req, res) => {
    const schema = Joi.object().keys({
      code: Joi.string().trim().alphanum().max(3).required(),
      inputPlan: Joi.string().trim().regex(/[A-C]{1}/).required(),
      recName: Joi.string().trim().normalize().regex(/^[A-z ,.'-]+$/).required(),
      recPhone: Joi.string().trim().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/).required(),
      recAddr: Joi.string().trim().min(7).required(),
      recCity: Joi.string().trim().min(2).required(),
      recState: Joi.string().trim().regex(/[A-Z]{2}-[A-Z]{2}/).required(),
      trackingNumber0: Joi.string().trim().alphanum().min(7).required(),
      inputType0: Joi.string().trim().max(7).required(),
      inputAmount0: Joi.string().trim().alphanum().max(4).required(),
    }).unknown(true);

    Joi.validate(req.body, schema, (err, value) => {
      if (err) {
        console.log(err);
        req.flash('form', err);
        req.user.getIDCards().then((photoIDs) => {
          res.render('newOrder', {
            user: req.user,
            photoIDs: photoIDs,
            messages: req.flash('form'),
          });
        });
      } else {
        const body = req.body;
        if (body.inputPlan == 'B') {
          Order.create({
            idCardId: body.photoId,
            customerId: body.userID,
            code: body.code,
            plan: body.inputPlan,
            recName: body.recName,
            recPhone: body.recPhone,
            recAddr: body.recAddr,
            recCity: body.recCity,
            recState: body.recState,
            status: 'Created',
            paid: false,
          }).then((order) => {
            const orderID = order.id;
            const trackingNumbers = Object.keys(body).filter((v) => v.startsWith('t'));
            trackingNumbers.forEach((trackingNumber) => {
              const suffix = trackingNumber.slice(-1);
              Package.create({
                orderId: orderID,
                category: body['inputType' + suffix],
                amount: body['inputAmount' + suffix],
                trackingNumber: body['trackingNumber' + suffix],
              }).catch((err) => {
                console.log(err);
              });
            });
            res.redirect('/orders');
          }).catch((err) => {
            console.log(err);
            req.flash('form', err);
            req.user.getIDCards().then((photoIDs) => {
              res.render('newOrder', {
                user: req.user,
                photoIDs: photoIDs,
                messages: req.flash('form'),
              });
            });
          });
        } else {
          Order.create({
            customerId: body.userID,
            code: body.code,
            plan: body.inputPlan,
            recName: body.recName,
            recPhone: body.recPhone,
            recAddr: body.recAddr,
            recCity: body.recCity,
            recState: body.recState,
            status: 'Created',
            paid: false,
          }).then((order) => {
            const orderID = order.id;
            const trackingNumbers = Object.keys(body).filter((v) => v.startsWith('t'));
            trackingNumbers.forEach((trackingNumber) => {
              const suffix = trackingNumber.slice(-1);
              Package.create({
                orderId: orderID,
                category: body['inputType' + suffix],
                amount: body['inputAmount' + suffix],
                trackingNumber: body['trackingNumber' + suffix],
              }).catch((err) => {
                console.log(err);
              });
            });
            res.redirect('/orders');
          }).catch((err) => {
            console.log(err);
            req.flash('form', err);
            req.user.getIDCards().then((photoIDs) => {
              res.render('newOrder', {
                user: req.user,
                photoIDs: photoIDs,
                messages: req.flash('form'),
              });
            });
          });
        }
      }
    });
  });
  app.get('/orders/view/:orderID', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      Order.findOne({
        where: {
          id: req.params.orderID,
        },
      }).then((order) => {
        order.getPackages().then((packages) => {
          order.getIDCard().then((photoID) => {
            console.log(photoID);
            res.render('viewOrder', {
              user: req.user,
              order: order,
              packages: packages,
              photoID: photoID,
            });
          });
        });
      }).catch((err) => {
        console.log(err);
        res.send(404);
      });
    } else {
      Order.findOne({
        where: {
          id: req.params.orderID,
          customerId: req.user.id,
        },
      }).then((order) => {
        order.getPackages().then((packages) => {
          order.getIDCard().then((photoID) => {
            res.render('viewOrder', {
              user: req.user,
              order: order,
              packages: packages,
              photoID: photoID,
            });
          });
        });
      }).catch((err) => {
        console.log(err);
        res.send(404);
      });
    }
  });
  app.post('/orders/edit', checkAuth, (req, res) => {
    const schema = Joi.object().keys({
      code: Joi.string().trim().alphanum().max(3).required(),
      plan: Joi.string().trim().regex(/[A-C]{1}/).required(),
      recName: Joi.string().trim().normalize().regex(/^[A-z ,.'-]+$/).required(),
      recPhone: Joi.string().trim().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/).required(),
      recAddr: Joi.string().trim().min(7).required(),
      recCity: Joi.string().trim().min(2).required(),
      recState: Joi.string().trim().regex(/[A-Z]{2}-[A-Z]{2}/).required(),
    }).unknown(true);
    if (app.config.admins.includes(req.user.discordID)) {
      Order.findOne({
        where: {
          id: req.body.orderID,
        },
      }).then((order) => {
        Joi.validate(req.body, schema, (err, value) => {
          if (err) {
            console.log(err);
            res.redirect('back');
          } else {
            order.update({
              code: req.body.code,
              plan: req.body.plan,
              recName: req.body.recName,
              recPhone: req.body.recPhone,
              recAddr: req.body.recAddr,
              recCity: req.body.recCity,
              recState: req.body.recState,
            }).then((order) => {
              res.redirect('back');
            });
          }
        });
      }).catch((err) => {
        console.log(err);
        res.send(404);
      });
    } else {
      Order.findOne({
        where: {
          id: req.body.orderID,
          customerId: req.user.id,
        },
      }).then((order) => {
        Joi.validate(req.body, schema, (err, value) => {
          if (err) {
            console.log(err);
            res.redirect('back');
          } else {
            order.update({
              code: req.body.code,
              plan: req.body.plan,
              recName: req.body.recName,
              recPhone: req.body.recPhone,
              recAddr: req.body.recAddr,
              recCity: req.body.recCity,
              recState: req.body.recState,
            }).then((order) => {
              res.redirect('back');
            });
          }
        });
      }).catch((err) => {
        console.log(err);
        res.send(404);
      });
    }
  });
  app.post('/orders/delete', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      Order.destroy({
        where: {
          id: req.body.id,
        },
      }).then(() => {
        res.redirect('/orders');
      }).catch((err) => {
        console.log(err);
        res.redirect('/orders');
      });
    } else {
      res.send('Please contact an admin to delete an order!');
    }
  });
  app.post('/packages/edit', checkAuth, (req, res) => {
    const schema = Joi.object().keys({
      trackingNumber: Joi.string().trim().alphanum().min(7).required(),
      category: Joi.string().trim().max(7).required(),
      amount: Joi.string().trim().alphanum().max(4).required(),
    }).unknown(true);
    if (app.config.admins.includes(req.user.discordID)) {
      Joi.validate(req.body, schema, (err, value) => {
        if (err) {
          console.log(err);
          Order.findOne({
            where: {
              id: req.body.orderID,
            },
          }).then((order) => {
            res.redirect('back');
          }).catch((err) => {
            console.log(err);
            res.send(404);
          });
        } else {
          Package.findOne({
            where: {
              id: req.body.packageID,
            },
          }).then((package) => {
            package.update({
              trackingNumber: req.body.trackingNumber,
              category: req.body.category,
              amount: req.body.amount,
            }).then((package) => {
              console.log(req.body);
              Order.findOne({
                where: {
                  id: req.body.orderID,
                },
              }).then((order) => {
                res.redirect('back');
              });
            }).catch((err) => {
              console.log(err);
              res.send(404);
            });
          });
        }
      });
    } else {
      Joi.validate(req.body, schema, (err, value) => {
        if (err) {
          console.log(err);
          Order.findOne({
            where: {
              id: req.body.orderID,
              customerId: req.user.id,
            },
          }).then((order) => {
            res.redirect('back');
          }).catch((err) => {
            console.log(err);
            res.send(404);
          });
        } else {
          Package.findOne({
            where: {
              id: req.body.packageID,
            },
          }).then((package) => {
            package.update({
              trackingNumber: req.body.trackingNumber,
              category: req.body.category,
              amount: req.body.amount,
            }).then((package) => {
              Order.findOne({
                where: {
                  id: req.body.orderID,
                  customerId: req.user.id,
                },
              }).then((order) => {
                res.redirect('back');
              });
            });
          }).catch((err) => {
            console.log(err);
            res.send(404);
          });
        }
      });
    }
  });
  app.post('/packages/delete', checkAuth, (req, res) => {
    if (app.config.admins.includes(req.user.discordID)) {
      Package.destroy({
        where: {
          id: req.body.id,
        },
      }).then(() => {
        res.redirect('/packages');
      }).catch((err) => {
        console.log(err);
        res.redirect('/packages');
      });
    } else {
      res.send('Please contact an admin to delete a package!');
    }
  });
  app.get('/settings', checkAuth, (req, res) => {
    res.render('settings', {
      user: req.user,
    });
  });
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  function checkAuth(req, res, next) {
    if (req.isAuthenticated() && !req.user.banned) return next();
    if (req.user && req.user.banned) return res.send('banned');
    res.redirect('/auth/discord');
  };
};
