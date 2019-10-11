const wrap = function(obj){
      return new Proxy(obj, {
              get(target, propKey) {
                                  return target[propKey]+1;
                                      }
                                        })
      }
      var object = { message: 'hello world' }
      object = wrap(object);
      console.log(object.message)
      console.log(JSON.stringify(object))
      console.log((object))

object.a={1}
      console.log(object.a)
object.a={2}
      console.log(JSON.stringify(object))
      console.log(object.toString)
