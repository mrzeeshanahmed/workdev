import { describe, it, expect } from 'vitest';
import * as reviews from '../reviews.service';
describe('reviews.service', () => {
    it('exports createReview and getReputation', () => {
        expect(typeof reviews.createReview === 'function').toBeTruthy();
        expect(typeof reviews.getReputation === 'function').toBeTruthy();
    });
});
