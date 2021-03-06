const chai = require('chai');
const { assert } = chai;
const Show = require('../../lib/models/show');

describe('TV show model', () => {

    const getErrors = (validation, numberExpected) => {
        assert.isDefined(validation);
        const errors = validation.errors;
        assert.equal(Object.keys(errors).length, numberExpected);
        return errors;
    };

    it('validates a good tv show model', () => {
        const data = {
            name: 'Big Mouth',
            genre: 'Comedy',
            characters: ['Nick', 'Andrew', 'Jessi', 'Jay'],
            numberOfSeasons: 1,
            moreInfo: {
                yearReleased: 2017,
                creator: ['Nick Kroll', 'Andrew Goldberg', 'Jennifer Flackett', 'Mark Levin'],
                availableOn: 'Netflix',
                rating: 5
            }
        };

        const show = new Show(data);
        const json = show.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(show.validateSync());
    });

    it('validates required fields, duh!', () => {
        const show = new Show({});
        const errors = getErrors(show.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.genre.kind, 'required');

    });

    it('validates at least one season is available', () => {
        const show = new Show({
            name: 'Archer',
            genre: 'Comedy',
            numberOfSeasons: 0
        });

        const errors = getErrors(show.validateSync(), 1);
        assert.equal(errors.numberOfSeasons.kind, 'min');
        console.log(errors.numberOfSeasons.message);

    });

    it('validates rating is no less than 1', () => {
        const show = new Show({
            name: 'Big Mouth',
            genre: 'Comedy',
            moreInfo: {
                rating: 0
            }
        });

        const errors = getErrors(show.validateSync(), 1);
        assert.equal(errors['moreInfo.rating'].kind, 'min');
        console.log(errors['moreInfo.rating'].message);

    });

    it('validates rating is no more than 5', () => {
        const show = new Show({
            name: 'Big Mouth',
            genre: 'Comedy',
            moreInfo: {
                rating: 6
            }
        });

        const errors = getErrors(show.validateSync(), 1);
        assert.equal(errors['moreInfo.rating'].kind, 'max');
        console.log(errors['moreInfo.rating'].message);

    });

    it('limits genre to comedy, action, thriller, crime, sci-fi, drama, fantasy', () => {
        const show = new Show({
            name: 'Breaking Bad',
            genre: 'Drama/Crime'
        });

        const errors = getErrors(show.validateSync(), 1);
        assert.equal(errors.genre.kind, 'enum');
    });

    it('defaults Chuck Norris as a character if none specified', () => {
        const show = new Show({
            name: 'Stranger Things',
            genre: 'Sci-Fi',
        });

        assert.deepEqual(show.characters, ['Chuck Norris']);
    });
}); 