import { test, expect } from '@playwright/test';

// API testing with the request fixture: no browser page is involved.
interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const apiBase = 'https://jsonplaceholder.typicode.com';

test.describe('API with the request fixture', () => {
  test('GET returns a post with the expected id', async ({ request }) => {
    const response = await request.get(`${apiBase}/posts/1`);
    expect(response.status()).toBe(200);
    const post = (await response.json()) as Post;
    expect(post.id).toBe(1);
    expect(post.title).toBeTruthy();
  });

  test('POST creates a new post', async ({ request }) => {
    const response = await request.post(`${apiBase}/posts`, {
      data: { title: 'framework demo', body: 'created by Playwright', userId: 1 },
    });
    expect(response.status()).toBe(201);
    const post = (await response.json()) as Post;
    expect(post.title).toBe('framework demo');
  });
});
