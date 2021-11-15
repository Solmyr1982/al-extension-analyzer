const angelMowersPromise = new Promise<string>((resolve, reject) => {
    // a resolved promise after certain hours
    setTimeout(() => {
        resolve('We finished mowing the lawn');
    }, 100000) // resolves after 100,000ms
    reject("We couldn't mow the lawn");
});


const myPaymentPromise = new Promise<Record<string, number | string>>((resolve, reject) => {
    // a resolved promise with  an object of 1000 Euro payment
    // and a thank you message
    setTimeout(() => {
        resolve({
            amount: 1000,
            note: 'Thank You',
        });
    }, 100000);
    // reject with 0 Euro and an unstatisfatory note
    reject({
        amount: 0,
        note: 'Sorry Lawn was not properly Mowed',
    });
});


angelMowersPromise
    .then(() => myPaymentPromise.then(res => console.log(res)))
    .catch(error => console.log(error));



class TestSubClass {
    doSubJob() {

    }

}

class TestParentClass {

    finishJob(testSubClass: TestSubClass) {

    };

    doMainJob() {

        let testSubClass = new TestSubClass();

        const doMainJob = new Promise<void>((resolve) => {
            testSubClass = new TestSubClass();
            resolve();
        });

        const doSubJob = new Promise<void>((resolve) => {
            //let testSubClass = new TestSubClass();
            testSubClass.doSubJob();
            resolve();
        });

        const finishTheJob = new Promise<void>((resolve) => {
            //let testSubClass = new TestSubClass();
            //testSubClass.doSubJob();
            this.finishJob(testSubClass);
            resolve();
        });

        doMainJob.then(() => doSubJob.then(() => finishTheJob));

    }






}