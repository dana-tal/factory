(function () {
  const mydb = db.getSiblingDB("factoryDB");

  const departments = mydb.departments.find().toArray();

  departments.forEach(function (dept) {
    const manager = mydb.employees
      .find({ departmentId: dept._id })
      .sort({ lastName: 1, firstName: 1 })
      .limit(1)
      .toArray()[0];

    if (manager) {
      mydb.departments.updateOne(
        { _id: dept._id },
        { $set: { managerId: manager._id } }
      );
      print(`Assigned ${manager.firstName} ${manager.lastName} as manager of ${dept.name}`);
    } else {
      print(`No employees found for department: ${dept.name}`);
    }
  });
})();
