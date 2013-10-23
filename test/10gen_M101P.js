/**
 * Created with JetBrains PhpStorm.
 * User: francis
 * Date: 10/23/13
 * Time: 3:38 PM
 */


isReady.then(function () {

  module("10gen Education: M101P");

  test("Homework 2.1", function () {
    var grades = new SimpleGrades();
    var cursor = grades.query({
      type: "exam",
      score: {$gte: 65}
    });
    var student = cursor.sort({'score': 1}).limit(1).first();
    equal(student.student_id, 22, "Student ID with lowest exam score is 22");

  });

    test("Homework 2.2", function () {
      var grades = new SimpleGrades();
      var lowest = grades.aggregate(
        {'$match': { "type": "homework"}},
        {'$group':{'_id':'$student_id', 'score':{$min:'$score'}}},
        {'$sort':{'_id': 1, 'score': 1}}
      );

      var homework = grades.query({type: 'homework'}).sort({'student_id': 1, 'score': 1}).all();
      var ids = [];

      for (var i = 0, j = 0; i < lowest.length; i++) {
        console.log(homework[j]['student_id'] + " - " + lowest[i]['_id']);
        if (homework[j]['student_id'] == lowest[i]['_id'] && homework[j]['score'] == lowest[i]['score']) {
          ids.push(homework[j]['_id']);
          while (homework[j]['student_id'] == lowest[i]['_id']) j++;
        }
      }

      equal(ids.length, 200, "200 minimum homework scores found");
      var result = Mingo.remove(grades.toJSON(), {'_id': {$in: ids}});

//      grades = new MingoCollection(data);
      equal(result.length, 600, "remove lowest homework from grades for each student. count is 600")


    });

});