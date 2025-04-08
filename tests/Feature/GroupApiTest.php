<?php

namespace Tests\Feature;

use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GroupApiTest extends TestCase
{
    use RefreshDatabase;
    protected $defaultHeaders = [
        'Accept-Language' => 'en', // Default locale
    ];
    protected function setUp(): void
    {
        parent::setUp();
        app()->setLocale('en'); // Default to English for tests
    }

    #[Test]
    public function it_can_create_a_group_without_authentication()
    {
        $response = $this->postJson('/api/groups', [
            'title' => 'My Group',
            'description' => 'A test group',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'description', 'view_token', 'edit_token'],
                // 'links' => ['view', 'edit'],
            ]);

        $this->assertDatabaseHas('groups', ['title' => 'My Group']);
    }

    #[Test]
    public function it_can_create_group_with_members()
    {
        $response = $this->postJson('/api/groups', [
            'title' => 'Group with Members',
            'description' => 'A test group with members',
            'members' => [
                ['name' => 'Alice', 'ratio' => 2],
                ['name' => 'Bob', 'ratio' => 1],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description',
                    'view_token',
                    'edit_token',
                    'members' => [
                        '*' => ['id', 'name', 'ratio', 'group_id'],
                    ],
                ],
            ])
            ->assertJsonFragment(['title' => 'Group with Members'])
            ->assertJsonCount(2, 'data.members');

        $this->assertDatabaseHas('groups', ['title' => 'Group with Members']);
        $this->assertDatabaseHas('members', ['name' => 'Alice', 'ratio' => 2]);
        $this->assertDatabaseHas('members', ['name' => 'Bob', 'ratio' => 1]);
    }

    #[Test]
    public function it_fails_to_create_group_with_invalid_members()
    {
        $response = $this->postJson('/api/groups', [
            'title' => 'Invalid Group',
            'members' => [
                ['avatar' => 'alice.jpg'], // Missing required name and ratio
                ['name' => 'Bob', 'ratio' => -1], // Invalid ratio
            ],
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors'])
            ->assertJsonFragment(['message' => 'The members.0.name field is required. (and 2 more errors)'])
            ->assertJsonFragment([
                'errors' => [
                    "members.0.name" => ["The members.0.name field is required."],
                    "members.0.ratio" => ["The members.0.ratio field is required."],
                    "members.1.ratio" => ["The members.1.ratio field must be at least 1."],
                ]
            ]);
    }

    #[Test]
    public function it_can_view_group_with_view_token()
    {
        $group = Group::create(['title' => 'Viewable Group']);

        $response = $this->getJson("/api/groups/{$group->view_token}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'title', 'description', 'members', 'view_token', 'edit_token']])
            ->assertJson([
                'data' => [
                    'title' => 'Viewable Group',
                    'edit_token' => null,
                ],
            ]);
    }

    #[Test]
    public function it_can_view_group_with_edit_token()
    {
        $group = Group::create(['title' => 'Editable Group']);

        $response = $this->getJson("/api/groups/{$group->edit_token}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'title', 'description', 'members', 'view_token', 'edit_token']])
            ->assertJson([
                'data' => [
                    'title' => 'Editable Group',
                    'edit_token' => $group->edit_token,
                ],
            ]);
    }

    #[Test]
    public function it_can_update_group_with_edit_token()
    {
        $group = Group::create(['title' => 'Editable Group']);

        $response = $this->putJson("/api/groups/{$group->edit_token}", [
            'title' => 'Updated Group',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'title', 'description', 'edit_token']])
            ->assertJson(['data' => ['title' => 'Updated Group']]);
    }

    #[Test]
    public function it_cannot_update_group_with_view_token()
    {
        $group = Group::create(['title' => 'Locked Group']);

        $response = $this->putJson("/api/groups/{$group->view_token}", [
            'title' => 'Updated Group',
        ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'You are not authorized']);
    }

    #[Test]
    public function it_can_add_member_with_edit_token()
    {
        $group = Group::create(['title' => 'Group with Members']);

        $response = $this->postJson("/api/groups/{$group->edit_token}/members", [
            'name' => 'Alice',
            'ratio' => 50,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'name', 'ratio']])
            ->assertJson(['data' => ['name' => 'Alice', 'ratio' => 50]]);
    }

    #[Test]
    public function it_cannot_add_member_with_view_token()
    {
        $group = Group::create(['title' => 'View Only Group']);

        $response = $this->postJson("/api/groups/{$group->view_token}/members", [
            'name' => 'Bob',
            'ratio' => 50,
        ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'You are not authorized']);
    }

    #[Test]
    public function it_returns_404_for_invalid_token()
    {
        $response = $this->getJson('/api/groups/invalid-token');

        $response->assertStatus(404);
        // ->assertJson(['message' => 'Page not found']);
    }

    #[Test]
    public function it_returns_404_for_missing_token()
    {
        $response = $this->getJson('/api/groups/');

        $response->assertStatus(404);
        // ->assertJson(['message' => 'Page not found']);
    }
}
